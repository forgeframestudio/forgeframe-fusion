import assert from "node:assert/strict";
import test from "node:test";
import { CapabilityRegistry } from "../src/registry.js";
import { execute } from "../src/executor.js";

test("executor falls back when the best provider fails", async () => {
  const registry = new CapabilityRegistry();
  registry.register({ id: "primary", capabilities: ["reasoning"], quality: 1, estimatedLatencyMs: 10, estimatedCostUsd: 0, available: true });
  registry.register({ id: "fallback", capabilities: ["reasoning"], quality: 0.9, estimatedLatencyMs: 20, estimatedCostUsd: 0, available: true });

  const result = await execute(
    { goal: "test" },
    { goal: "test", steps: [{ id: "s1", capability: "reasoning", instruction: "test", dependsOn: [] }] },
    registry,
    async (id) => { if (id === "primary") throw new Error("offline"); return "ok"; },
  );
  assert.equal(result[0].providerId, "fallback");
});
