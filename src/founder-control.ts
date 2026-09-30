import type { OperatorPlan, OperatorStep } from "./operator.js";

export interface FounderApprovalItem {
  id: string;
  objective: string;
  description: string;
  risk: OperatorStep["action"]["risk"];
  tool?: string;
  estimatedExternalCostUsd?: number;
}

export interface FounderControlSnapshot {
  objective: string;
  completed: number;
  ready: number;
  awaitingApproval: number;
  blocked: number;
  approvals: FounderApprovalItem[];
}

export function founderControlSnapshot(plan: OperatorPlan): FounderControlSnapshot {
  const approvals = plan.steps
    .filter((step) => step.state === "waiting_approval")
    .map((step) => ({
      id: step.action.id,
      objective: plan.objective,
      description: step.action.description,
      risk: step.action.risk,
      tool: step.action.tool,
      estimatedExternalCostUsd: step.action.estimatedExternalCostUsd,
    }));

  return {
    objective: plan.objective,
    completed: plan.steps.filter((step) => step.state === "completed").length,
    ready: plan.steps.filter((step) => step.state === "ready").length,
    awaitingApproval: approvals.length,
    blocked: plan.steps.filter((step) => step.state === "blocked").length,
    approvals,
  };
}
