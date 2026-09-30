import assert from "node:assert/strict";
import test from "node:test";
import { decideAction, safeOperatorDefaults } from "../src/permissions.js";

test("safe operator defaults allow observation and creation", () => {
  assert.equal(decideAction({ id: "1", risk: "observe", description: "Inspect project" }).status, "allowed");
  assert.equal(decideAction({ id: "2", risk: "create", description: "Generate draft" }).status, "allowed");
});

test("consequential actions stop for approval by default", () => {
  for (const risk of ["publish", "communicate", "spend", "delete"] as const) {
    assert.equal(decideAction({ id: risk, risk, description: risk }).status, "approval_required");
  }
});

test("project permissions can explicitly deny an action", () => {
  const permissions = { ...safeOperatorDefaults, publish: "deny" as const };
  assert.equal(decideAction({ id: "3", risk: "publish", description: "Deploy production" }, permissions).status, "denied");
});
