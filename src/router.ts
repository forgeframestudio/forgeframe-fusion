import type { Constraints, ProviderProfile } from "./types.js";

export function rank(candidates: ProviderProfile[], constraints: Constraints = {}): ProviderProfile[] {
  return candidates
    .filter((p) => {
      if (!p.available) return false;
      if (constraints.requireLocal && !p.local) return false;
      if (constraints.maxCostUsd !== undefined && p.estimatedCostUsd > constraints.maxCostUsd) return false;
      if (constraints.maxLatencyMs !== undefined && p.estimatedLatencyMs > constraints.maxLatencyMs) return false;
      return true;
    })
    .sort((a, b) => {
      const score = (p: ProviderProfile) =>
        p.quality * 100 - p.estimatedCostUsd * 10 - p.estimatedLatencyMs / 1000;
      return score(b) - score(a);
    });
}

export function route(candidates: ProviderProfile[], constraints: Constraints = {}): ProviderProfile {
  const eligible = rank(candidates, constraints);
  if (!eligible.length) throw new Error("No eligible provider for required capability");
  return eligible[0];
}
