import type { FusionRequest, StepResult, VerificationResult } from "./types.js";

export function verify(request: FusionRequest, results: StepResult[]): VerificationResult {
  const failures: string[] = [];
  const failedStepIds = new Set<string>();
  if (!results.length) failures.push("No execution results were produced.");

  for (const result of results) {
    if (result.error || result.output === undefined || result.output === null) {
      failedStepIds.add(result.stepId);
      failures.push(`Step ${result.stepId} did not produce a usable result${result.error ? `: ${result.error}` : "."}`);
    }
  }

  const required = request.requiredCapabilities ?? [];
  for (const capability of required) {
    if (!results.some((r) => r.capability === capability && !r.error && r.output !== undefined && r.output !== null)) {
      failures.push(`Required capability ${capability} has no successful result.`);
    }
  }

  for (const deliverable of request.deliverables ?? []) {
    const mediaType = deliverable.kind === "video" ? "video/" : deliverable.kind === "audio" ? "audio/" : deliverable.kind === "image" ? "image/" : undefined;
    const hasArtifact = results.some((r) => typeof r.output === "object" && r.output !== null && "url" in r.output && (!mediaType || ("mediaType" in r.output && String((r.output as {mediaType:unknown}).mediaType).startsWith(mediaType))));
    if (!hasArtifact && deliverable.kind !== "text") failures.push(`Requested ${deliverable.kind} deliverable has no downloadable artifact URL.`);
  }

  const preserve = request.constraints?.preserve ?? [];
  if (preserve.length && !results.length) failures.push("Preservation constraints could not be evaluated.");

  const passed = failures.length === 0;
  return { passed, score: passed ? 1 : Math.max(0, 1 - failures.length / Math.max(1, results.length + required.length)), failures, failedStepIds: [...failedStepIds] };
}
