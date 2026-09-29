import assert from "node:assert/strict";
import test from "node:test";
import { buildRepairPlan } from "../src/repair.js";

test("repair targets only failed steps", () => {
  const plan = {
    goal: "make artwork",
    steps: [
      { id: "a", capability: "image.transform" as const, instruction: "transform", dependsOn: [] },
      { id: "b", capability: "identity.preserve" as const, instruction: "preserve identity", dependsOn: ["a"] },
    ],
  };
  const repair = buildRepairPlan(
    { goal: "make artwork" },
    plan,
    { passed: false, score: 0.5, failures: ["identity mismatch"], failedStepIds: ["b"] },
  );
  assert.equal(repair.steps.length, 1);
  assert.match(repair.steps[0].instruction, /preserve identity/);
});
