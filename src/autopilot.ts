import { AuditLog } from "./audit.js";
import { completeStep, executeStep, type StepExecution } from "./operator-executor.js";
import { nextRunnableStep, type OperatorPlan } from "./operator.js";
import type { OperatorContext, ToolRegistry } from "./tool-registry.js";

export interface AutopilotResult {
  plan: OperatorPlan;
  executions: StepExecution[];
  stoppedBecause: "no_ready_work" | "approval_required" | "blocked" | "complete";
}

export async function runSafeAutopilot(
  initialPlan: OperatorPlan,
  registry: ToolRegistry,
  context: OperatorContext,
  audit = new AuditLog(),
): Promise<AutopilotResult> {
  let plan = initialPlan;
  const executions: StepExecution[] = [];

  while (true) {
    const step = nextRunnableStep(plan);
    if (!step) break;

    audit.record({
      objective: plan.objective,
      actionId: step.action.id,
      risk: step.action.risk,
      status: "started",
      tool: step.action.tool,
      projectId: context.projectId,
      accountSubject: context.accountSubject,
      externalCostUsd: step.action.estimatedExternalCostUsd,
    });

    try {
      const execution = await executeStep(step, registry, context);
      executions.push(execution);
      plan = completeStep(plan, execution);
      audit.record({
        objective: plan.objective,
        actionId: step.action.id,
        risk: step.action.risk,
        status: "completed",
        tool: execution.toolId,
        projectId: context.projectId,
        accountSubject: context.accountSubject,
        summary: execution.result.summary,
        externalCostUsd: step.action.estimatedExternalCostUsd,
      });
    } catch (error) {
      audit.record({
        objective: plan.objective,
        actionId: step.action.id,
        risk: step.action.risk,
        status: "failed",
        tool: step.action.tool,
        projectId: context.projectId,
        accountSubject: context.accountSubject,
        summary: error instanceof Error ? error.message : "Unknown operator failure.",
        externalCostUsd: step.action.estimatedExternalCostUsd,
      });
      throw error;
    }
  }

  const waiting = plan.steps.some((step) => step.state === "waiting_approval");
  const blocked = plan.steps.some((step) => step.state === "blocked");
  const complete = plan.steps.every((step) => step.state === "completed");

  return {
    plan,
    executions,
    stoppedBecause: complete ? "complete" : waiting ? "approval_required" : blocked ? "blocked" : "no_ready_work",
  };
}
