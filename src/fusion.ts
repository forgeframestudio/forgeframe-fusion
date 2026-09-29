import { execute, type ProviderRunner } from "./executor.js";
import { plan } from "./planner.js";
import { CapabilityRegistry } from "./registry.js";
import { verify } from "./verifier.js";
import type { FusionRequest } from "./types.js";

export class ForgeFrameFusion {
  constructor(
    private readonly registry: CapabilityRegistry,
    private readonly runner: ProviderRunner,
  ) {}

  async run(request: FusionRequest) {
    const executionPlan = plan(request);
    const results = await execute(request, executionPlan, this.registry, this.runner);
    const verification = verify(request, results);

    return {
      request,
      plan: executionPlan,
      results,
      verification,
      needsRepair: !verification.passed,
    };
  }
}
