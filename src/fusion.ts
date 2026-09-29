import { execute, type ProviderRunner } from "./executor.js";
import { plan } from "./planner.js";
import { CapabilityRegistry } from "./registry.js";
import { verify } from "./verifier.js";
import { buildRepairPlan } from "./repair.js";
import type { ExecutionPlan, FusionRequest, StepResult } from "./types.js";

export interface FusionOptions { maxRepairPasses?: number; }

export class ForgeFrameFusion {
  constructor(
    private readonly registry: CapabilityRegistry,
    private readonly runner: ProviderRunner,
    private readonly options: FusionOptions = {},
  ) {}

  async run(request: FusionRequest) {
    const executionPlan = plan(request);
    let results = await execute(request, executionPlan, this.registry, this.runner);
    let verification = verify(request, results);
    const repairs: Array<{ plan: ExecutionPlan; results: StepResult[] }> = [];

    for (let pass = 0; !verification.passed && pass < (this.options.maxRepairPasses ?? 2); pass++) {
      const repair = buildRepairPlan(request, executionPlan, verification);
      if (!repair.steps.length) break;
      const repairPlan: ExecutionPlan = { goal: request.goal, steps: repair.steps };
      const repairResults = await execute(request, repairPlan, this.registry, this.runner);
      repairs.push({ plan: repairPlan, results: repairResults });
      results = [...results, ...repairResults];
      verification = verify(request, results);
    }

    return { request, plan: executionPlan, results, repairs, verification, completed: verification.passed };
  }
}
