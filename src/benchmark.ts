import type { ForgeFrameFusion } from "./fusion.js";
import type { FusionRequest } from "./types.js";

export interface BenchmarkResult {
  elapsedMs: number;
  completed: boolean;
  providerCalls: number;
  repairPasses: number;
}

export async function benchmark(fusion: ForgeFrameFusion, request: FusionRequest): Promise<BenchmarkResult> {
  const started = Date.now();
  const result = await fusion.run(request);
  return {
    elapsedMs: Date.now() - started,
    completed: result.completed,
    providerCalls: result.results.length,
    repairPasses: result.repairs.length,
  };
}
