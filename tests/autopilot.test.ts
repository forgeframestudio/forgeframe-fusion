import assert from "node:assert/strict";
import test from "node:test";
import { buildOperatorPlan } from "../src/operator.js";
import { runSafeAutopilot } from "../src/autopilot.js";
import { ToolRegistry } from "../src/tool-registry.js";

test("autopilot runs safe work and stops at founder approval", async () => {
  const registry = new ToolRegistry()
    .register({ id: "content.create", risk: "create", async execute() { return { ok: true, summary: "Content ready." }; } })
    .register({ id: "instagram.publish", risk: "publish", async execute() { return { ok: true, summary: "Published." }; } });

  const plan = buildOperatorPlan("Grow ForgeFrame", [
    { id: "create", risk: "create", description: "Create post", tool: "content.create" },
    { id: "publish", risk: "publish", description: "Publish post", tool: "instagram.publish" },
  ]);

  const result = await runSafeAutopilot(plan, registry, { objective: plan.objective });
  assert.equal(result.executions.length, 1);
  assert.equal(result.plan.steps[0].state, "completed");
  assert.equal(result.plan.steps[1].state, "waiting_approval");
  assert.equal(result.stoppedBecause, "approval_required");
});
