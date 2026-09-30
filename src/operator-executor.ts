import type { OperatorPlan, OperatorStep } from "./operator.js";
import type { OperatorContext, OperatorToolResult, ToolRegistry } from "./tool-registry.js";

export interface StepExecution {
  stepId: string;
  toolId: string;
  result: OperatorToolResult;
}

export function approveStep(plan: OperatorPlan, stepId: string): OperatorPlan {
  return transitionApproval(plan, stepId, "ready", "Approved by an authorized user.");
}

export function denyStep(plan: OperatorPlan, stepId: string): OperatorPlan {
  return transitionApproval(plan, stepId, "blocked", "Denied by an authorized user.");
}

function transitionApproval(plan: OperatorPlan, stepId: string, state: "ready" | "blocked", note: string): OperatorPlan {
  let found = false;
  const steps = plan.steps.map((step) => {
    if (step.action.id !== stepId) return step;
    found = true;
    if (step.state !== "waiting_approval") throw new Error(`Step ${stepId} is not awaiting approval.`);
    return { ...step, state, note };
  });
  if (!found) throw new Error(`Unknown operator step: ${stepId}`);
  return { ...plan, steps };
}

export async function executeStep(
  step: OperatorStep,
  registry: ToolRegistry,
  context: OperatorContext,
  input?: unknown,
): Promise<StepExecution> {
  if (step.state !== "ready") throw new Error(`Step ${step.action.id} is not ready for execution.`);
  if (!step.action.tool) throw new Error(`Step ${step.action.id} has no executable tool.`);
  const tool = registry.get(step.action.tool);
  if (!tool) throw new Error(`Tool is not registered: ${step.action.tool}`);
  if (tool.risk !== step.action.risk) throw new Error(`Tool risk mismatch for ${tool.id}.`);
  const result = await tool.execute(input, context);
  if (!result.ok) throw new Error(result.summary || `Tool ${tool.id} failed.`);
  return { stepId: step.action.id, toolId: tool.id, result };
}

export function completeStep(plan: OperatorPlan, execution: StepExecution): OperatorPlan {
  return {
    ...plan,
    steps: plan.steps.map((step) =>
      step.action.id === execution.stepId
        ? { ...step, state: "completed", note: execution.result.summary }
        : step,
    ),
  };
}
