import type { FusionRequest, StepResult, VerificationResult } from "./types.js";

export function verify(request: FusionRequest, results: StepResult[]): VerificationResult {
  const failures: string[] = [];
  if (!results.length) failures.push("No execution results were produced.");
  const preserve = request.constraints?.preserve ?? [];
  if (preserve.length && !results.length) failures.push("Preservation constraints could not be evaluated.");
  return {
    passed: failures.length === 0,
    score: failures.length === 0 ? 1 : 0,
    failures,
  };
}
