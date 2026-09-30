import assert from "node:assert/strict";
import test from "node:test";
import { buildOperatorPlan, nextRunnableStep, pendingApprovals } from "../src/operator.js";

test("operator separates autonomous work from approval-gated work", () => {
  const plan = buildOperatorPlan("Launch a business website", [
    { id: "inspect", risk: "observe", description: "Inspect project context" },
    { id: "build", risk: "create", description: "Build website" },
    { id: "deploy", risk: "publish", description: "Deploy website" },
    { id: "email", risk: "communicate", description: "Email launch announcement" },
  ]);
  assert.equal(nextRunnableStep(plan)?.action.id, "inspect");
  assert.deepEqual(pendingApprovals(plan).map((x) => x.action.id), ["deploy", "email"]);
});

test("operator plan keeps the user's objective attached to every workflow", () => {
  const plan = buildOperatorPlan("Make the site darker", [
    { id: "edit", risk: "create", description: "Revise current website" },
  ]);
  assert.equal(plan.objective, "Make the site darker");
  assert.equal(plan.steps[0]?.state, "ready");
});
