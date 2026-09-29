import assert from "node:assert/strict";
import test from "node:test";
import { CapabilityRegistry } from "../src/registry.js";
import { route } from "../src/router.js";

test("router prefers the stronger eligible provider", () => {
  const registry = new CapabilityRegistry();
  registry.register({ id: "slow-good", capabilities: ["reasoning"], quality: 0.95, estimatedLatencyMs: 1000, estimatedCostUsd: 0, available: true });
  registry.register({ id: "fast-good", capabilities: ["reasoning"], quality: 0.94, estimatedLatencyMs: 100, estimatedCostUsd: 0, available: true });
  assert.equal(route(registry.list("reasoning")).id, "fast-good");
});

test("router respects cost constraints", () => {
  const registry = new CapabilityRegistry();
  registry.register({ id: "paid", capabilities: ["image.transform"], quality: 1, estimatedLatencyMs: 100, estimatedCostUsd: 1, available: true });
  registry.register({ id: "free", capabilities: ["image.transform"], quality: 0.8, estimatedLatencyMs: 200, estimatedCostUsd: 0, available: true });
  assert.equal(route(registry.list("image.transform"), { maxCostUsd: 0 }).id, "free");
});
