import { decideAction, type PermissionProfile, type ProposedAction } from "./permissions.js";

export type OperatorStepState = "ready" | "waiting_approval" | "blocked" | "completed";

export interface OperatorStep {
  action: ProposedAction;
  state: OperatorStepState;
  note: string;
}

export interface OperatorPlan {
  objective: string;
  steps: OperatorStep[];
}

export function buildOperatorPlan(
  objective: string,
  actions: ProposedAction[],
  permissions?: PermissionProfile,
): OperatorPlan {
  return {
    objective,
    steps: actions.map((action) => {
      const decision = decideAction(action, permissions);
      return {
        action,
        state: decision.status === "allowed" ? "ready" : decision.status === "approval_required" ? "waiting_approval" : "blocked",
        note: decision.reason,
      };
    }),
  };
}

export function nextRunnableStep(plan: OperatorPlan): OperatorStep | null {
  return plan.steps.find((step) => step.state === "ready") ?? null;
}

export function pendingApprovals(plan: OperatorPlan): OperatorStep[] {
  return plan.steps.filter((step) => step.state === "waiting_approval");
}
