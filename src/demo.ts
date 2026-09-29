import { ForgeFrameFusion } from "./fusion.js";
import { CapabilityRegistry } from "./registry.js";

const registry = new CapabilityRegistry();

registry.register({
  id: "mock-reasoner",
  capabilities: ["reasoning", "vision.analysis"],
  quality: 0.9,
  estimatedLatencyMs: 300,
  estimatedCostUsd: 0,
  available: true,
});

registry.register({
  id: "mock-creative",
  capabilities: ["image.transform", "identity.preserve"],
  quality: 0.88,
  estimatedLatencyMs: 700,
  estimatedCostUsd: 0,
  available: true,
});

const fusion = new ForgeFrameFusion(
  registry,
  async (providerId, instruction) => ({ providerId, instruction, status: "prototype-ok" }),
);

const result = await fusion.run({
  goal: "Transform a reference football photo into high-toon artwork while preserving identity.",
  requiredCapabilities: ["reasoning", "image.transform", "identity.preserve", "vision.analysis"],
  constraints: { maxCostUsd: 0, preserve: ["identity", "uniform number", "team details"] },
});

console.log(JSON.stringify(result, null, 2));
