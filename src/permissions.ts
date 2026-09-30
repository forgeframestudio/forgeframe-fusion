export type ActionRisk = "observe" | "create" | "publish" | "communicate" | "spend" | "delete";
export type PermissionMode = "deny" | "ask" | "allow";

export interface PermissionProfile {
  observe: PermissionMode;
  create: PermissionMode;
  publish: PermissionMode;
  communicate: PermissionMode;
  spend: PermissionMode;
  delete: PermissionMode;
}

export interface ProposedAction {
  id: string;
  risk: ActionRisk;
  description: string;
  tool?: string;
  estimatedExternalCostUsd?: number;
}

export interface ActionDecision {
  status: "allowed" | "approval_required" | "denied";
  reason: string;
}

export const safeOperatorDefaults: PermissionProfile = {
  observe: "allow",
  create: "allow",
  publish: "ask",
  communicate: "ask",
  spend: "ask",
  delete: "ask",
};

export function decideAction(
  action: ProposedAction,
  permissions: PermissionProfile = safeOperatorDefaults,
): ActionDecision {
  const mode = permissions[action.risk];
  if (mode === "deny") return { status: "denied", reason: `${action.risk} actions are disabled for this project.` };
  if (mode === "ask") return { status: "approval_required", reason: `${action.risk} actions require approval before execution.` };
  return { status: "allowed", reason: `${action.risk} actions are pre-authorized for this project.` };
}
