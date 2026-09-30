import assert from "node:assert/strict";
import test from "node:test";
import { canCreate, createAnonymousSession, prototypeEntitlement } from "../src/entitlements.js";

test("prototype entitlement has a bounded creation allowance", () => {
  assert.equal(prototypeEntitlement.plan, "prototype");
  assert.equal(prototypeEntitlement.dailyCreationLimit, 12);
  assert.equal(prototypeEntitlement.cloudProjects, false);
  assert.equal(prototypeEntitlement.paidFallback, false);
});

test("anonymous sessions expose entitlement state without pretending to be an account", () => {
  const now = new Date("2026-09-30T00:00:00.000Z");
  const session = createAnonymousSession(now);
  assert.match(session.sessionId, /^[0-9a-f-]{36}$/i);
  assert.equal(session.createdAt, now.toISOString());
  assert.equal(session.entitlement.plan, "prototype");
  assert.ok(new Date(session.expiresAt).getTime() > now.getTime());
});

test("creation allowance rejects exhausted usage", () => {
  assert.equal(canCreate(0, prototypeEntitlement), true);
  assert.equal(canCreate(11, prototypeEntitlement), true);
  assert.equal(canCreate(12, prototypeEntitlement), false);
  assert.equal(canCreate(-1, prototypeEntitlement), false);
});
