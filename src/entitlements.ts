export type FusionPlan = "prototype" | "pro";

export interface Entitlement {
  plan: FusionPlan;
  dailyCreationLimit: number;
  cloudProjects: boolean;
  paidFallback: boolean;
}

export interface SessionState {
  sessionId: string;
  entitlement: Entitlement;
  createdAt: string;
  expiresAt: string;
}

export const prototypeEntitlement: Entitlement = {
  plan: "prototype",
  dailyCreationLimit: 12,
  cloudProjects: false,
  paidFallback: false,
};

export function createAnonymousSession(now = new Date()): SessionState {
  const createdAt = now.toISOString();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return {
    sessionId: crypto.randomUUID(),
    entitlement: prototypeEntitlement,
    createdAt,
    expiresAt: expires.toISOString(),
  };
}

export function canCreate(used: number, entitlement: Entitlement): boolean {
  return Number.isFinite(used) && used >= 0 && used < entitlement.dailyCreationLimit;
}
