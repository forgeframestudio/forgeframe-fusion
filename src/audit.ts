import type { ActionRisk } from "./permissions.js";

export type AuditStatus = "planned" | "approval_required" | "approved" | "denied" | "started" | "completed" | "failed";

export interface AuditEvent {
  timestamp: string;
  objective: string;
  actionId: string;
  risk: ActionRisk;
  status: AuditStatus;
  tool?: string;
  projectId?: string;
  accountSubject?: string;
  summary?: string;
  externalCostUsd?: number;
}

export class AuditLog {
  private readonly events: AuditEvent[] = [];

  record(event: Omit<AuditEvent, "timestamp">, now = new Date()): AuditEvent {
    const stored = { ...event, timestamp: now.toISOString() };
    this.events.push(stored);
    return stored;
  }

  all(): AuditEvent[] {
    return this.events.map((event) => ({ ...event }));
  }
}
