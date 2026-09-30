import assert from "node:assert/strict";
import test from "node:test";
import { AuditLog } from "../src/audit.js";

test("audit log records immutable action history snapshots", () => {
  const log = new AuditLog();
  log.record({ objective: "Build site", actionId: "build", risk: "create", status: "completed", tool: "artifact.create" }, new Date("2026-09-29T12:00:00Z"));
  const first = log.all();
  first[0].summary = "tampered";
  assert.equal(log.all()[0].summary, undefined);
  assert.equal(log.all()[0].timestamp, "2026-09-29T12:00:00.000Z");
});
