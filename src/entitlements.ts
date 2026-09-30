export type FusionPlan = "prototype" | "pro" | "founder";

export interface Entitlement {
  plan: FusionPlan;
  dailyCreationLimit: number | null;
  cloudProjects: boolean;
  paidFallback: boolean;
  admin: boolean;
  subscriptionRequired: boolean;
  externalSpendLimitUsd: number | null;
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
  admin: false,
  subscriptionRequired: false,
  externalSpendLimitUsd: 0,
};

export const proEntitlement: Entitlement = {
  plan: "pro",
  dailyCreationLimit: 100,
  cloudProjects: true,
  paidFallback: true,
  admin: false,
  subscriptionRequired: true,
  externalSpendLimitUsd: 5,
};

// Founder is an internal, server-assigned role. Never infer this entitlement
// from browser storage, display names, email text, query parameters, or client input.
export const founderEntitlement: Entitlement = {
  plan: "founder",
  dailyCreationLimit: null,
  cloudProjects: true,
  paidFallback: true,
  admin: true,
  subscriptionRequired: false,
  // Unlimited Fusion usage does not mean unlimited third-party spend.
  // Production may override this with an explicit server-side budget.
  externalSpendLimitUsd: 25,
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
  if (!Number.isFinite(used) || used < 0) return false;
  return entitlement.dailyCreationLimit === null || used < entitlement.dailyCreationLimit;
}

export function requiresSubscription(entitlement: Entitlement): boolean {
  return entitlement.subscriptionRequired;
}

export function canAdmin(entitlement: Entitlement): boolean {
  return entitlement.admin === true;
}
