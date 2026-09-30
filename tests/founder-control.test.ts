import assert from "node:assert/strict";
import test from "node:test";
import { buildOperatorPlan } from "../src/operator.js";
import { founderControlSnapshot } from "../src/founder-control.js";

test("founder control exposes only consequential approval items", () => {
  const plan = buildOperatorPlan("Launch ForgeFrame campaign", [
    { id: "design", risk: "create", description: "Create campaign art", tool: "image.create" },
    { id: "publish", risk: "publish", description: "Publish Instagram post", tool: "instagram.publish" },
    { id: "spend", risk: "spend", description: "Boost campaign", tool: "ads.spend", estimatedExternalCostUsd: 20 },
  ]);
  const view = founderControlSnapshot(plan);
  assert.equal(view.ready, 1);
  assert.equal(view.awaitingApproval, 2);
  assert.deepEqual(view.approvals.map((item) => item.id), ["publish", "spend"]);
});
