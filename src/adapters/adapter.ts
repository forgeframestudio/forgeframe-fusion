import type { Capability, ProviderProfile } from "../types.js";

export interface ProviderExecutionContext {
  inputs: Record<string, unknown>;
  dependencies: Record<string, unknown>;
}

export interface ProviderAdapter {
  profile(): ProviderProfile;
  supports(capability: Capability): boolean;
  healthcheck(): Promise<boolean>;
  run(instruction: string, context: ProviderExecutionContext): Promise<unknown>;
}
