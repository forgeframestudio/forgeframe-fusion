import type { ExecutionPlan, FusionRequest, PlanStep, VerificationResult } from "./types.js";

export interface RepairPlan {
  reason: string[];
  steps: PlanStep[];
}

export function buildRepairPlan(
  request: FusionRequest,
  original: ExecutionPlan,
  verification: VerificationResult,
): RepairPlan {
  if (verification.passed) return { reason: [], steps: [] };

  const failedIds = new Set(verification.failedStepIds ?? []);
  const steps = original.steps
    .filter((step) => failedIds.has(step.id))
    .map((step, i) => ({
      ...step,
      id: `repair-${i + 1}-${step.id}`,
      instruction: `Repair only this failed requirement. Preserve successful work. ${step.instruction}. Failures: ${verification.failures.join("; ")}`,
      dependsOn: [],
    }));

  return {
    reason: verification.failures,
    steps: steps.length ? steps : [{
      id: "repair-1",
      capability: "reasoning",
      instruction: `Diagnose and repair the minimum necessary work for: ${request.goal}. Failures: ${verification.failures.join("; ")}`,
      dependsOn: [],
    }],
  };
}
