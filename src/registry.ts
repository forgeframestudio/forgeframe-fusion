import type { Capability, ProviderProfile } from "./types.js";

export class CapabilityRegistry {
  private providers = new Map<string, ProviderProfile>();

  register(provider: ProviderProfile): void {
    this.providers.set(provider.id, provider);
  }

  list(capability: Capability): ProviderProfile[] {
    return [...this.providers.values()].filter(
      (p) => p.available && p.capabilities.includes(capability),
    );
  }

  all(): ProviderProfile[] {
    return [...this.providers.values()];
  }
}
