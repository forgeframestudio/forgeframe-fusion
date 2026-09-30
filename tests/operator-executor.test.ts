import assert from "node:assert/strict";
import test from "node:test";
import { buildOperatorPlan } from "../src/operator.js";
import { approveStep, completeStep, denyStep, executeStep } from "../src/operator-executor.js";
import { ToolRegistry } from "../src/tool-registry.js";

test("ready create work executes and completes", async () => {
  const registry = new ToolRegistry().register({
    id: "artifact.create",
    risk: "create",
    async execute(input) { return { ok: true, summary: "Artifact created.", output: input }; },
  });
  let plan = buildOperatorPlan("Build a site", [{ id: "build", risk: "create", description: "Build", tool: "artifact.create" }]);
  const execution = await executeStep(plan.steps[0], registry, { objective: plan.objective }, { page: "home" });
  plan = completeStep(plan, execution);
  assert.equal(plan.steps[0].state, "completed");
  assert.equal(execution.result.summary, "Artifact created.");
});

test("approval-gated work cannot execute until approved", async () => {
  const registry = new ToolRegistry().register({
    id: "site.publish",
    risk: "publish",
    async execute() { return { ok: true, summary: "Published." }; },
  });
  let plan = buildOperatorPlan("Launch", [{ id: "deploy", risk: "publish", description: "Deploy", tool: "site.publish" }]);
  await assert.rejects(() => executeStep(plan.steps[0], registry, { objective: plan.objective }), /not ready/);
  plan = approveStep(plan, "deploy");
  const execution = await executeStep(plan.steps[0], registry, { objective: plan.objective });
  plan = completeStep(plan, execution);
  assert.equal(plan.steps[0].state, "completed");
});

test("denied approval remains blocked", () => {
  let plan = buildOperatorPlan("Send outreach", [{ id: "email", risk: "communicate", description: "Email", tool: "email.send" }]);
  plan = denyStep(plan, "email");
  assert.equal(plan.steps[0].state, "blocked");
});
