import type { ProviderRunner } from "../executor.js";
import type { ProviderAdapter } from "./adapter.js";

export function createAdapterRunner(adapters: ProviderAdapter[]): ProviderRunner {
  const byId = new Map(adapters.map((adapter) => [adapter.profile().id, adapter]));

  return async (providerId, instruction, context) => {
    const adapter = byId.get(providerId);
    if (!adapter) throw new Error(`No adapter registered for provider: ${providerId}`);
    if (!(await adapter.healthcheck())) throw new Error(`Provider unavailable: ${providerId}`);
    return adapter.run(instruction, {
      inputs: (context.inputs ?? {}) as Record<string, unknown>,
      dependencies: (context.dependencies ?? {}) as Record<string, unknown>,
    });
  };
}
