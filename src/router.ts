import type { Constraints, ProviderProfile } from "./types.js";

export function route(
  candidates: ProviderProfile[],
  constraints: Constraints = {},
): ProviderProfile {
  const eligible = candidates.filter((p) => {
    if (constraints.maxCostUsd !== undefined && p.estimatedCostUsd > constraints.maxCostUsd) return false;
    if (constraints.maxLatencyMs !== undefined && p.estimatedLatencyMs > constraints.maxLatencyMs) return false;
    return true;
  });

  if (!eligible.length) throw new Error("No eligible provider for required capability");

  return eligible.sort((a, b) => {
    const scoreA = a.quality * 100 - a.estimatedCostUsd * 10 - a.estimatedLatencyMs / 1000;
    const scoreB = b.quality * 100 - b.estimatedCostUsd * 10 - b.estimatedLatencyMs / 1000;
    return scoreB - scoreA;
  })[0];
}
