import { CapabilityRegistry } from "./registry.js";
import { route } from "./router.js";
import type { ExecutionPlan, FusionRequest, StepResult } from "./types.js";

export type ProviderRunner = (
  providerId: string,
  instruction: string,
  context: Record<string, unknown>,
) => Promise<unknown>;

export async function execute(
  request: FusionRequest,
  plan: ExecutionPlan,
  registry: CapabilityRegistry,
  runner: ProviderRunner,
): Promise<StepResult[]> {
  const completed = new Map<string, StepResult>();
  const pending = new Map(plan.steps.map((s) => [s.id, s]));

  while (pending.size) {
    const ready = [...pending.values()].filter((s) =>
      s.dependsOn.every((id) => completed.has(id)),
    );
    if (!ready.length) throw new Error("Execution plan contains an unresolved dependency cycle");

    const batch = await Promise.all(
      ready.map(async (step): Promise<StepResult> => {
        const provider = route(registry.list(step.capability), request.constraints);
        const started = Date.now();
        const output = await runner(provider.id, step.instruction, {
          inputs: request.inputs ?? {},
          dependencies: Object.fromEntries(
            step.dependsOn.map((id) => [id, completed.get(id)?.output]),
          ),
        });
        return { stepId: step.id, providerId: provider.id, output, latencyMs: Date.now() - started };
      }),
    );

    for (const result of batch) {
      completed.set(result.stepId, result);
      pending.delete(result.stepId);
    }
  }

  return [...completed.values()];
}
