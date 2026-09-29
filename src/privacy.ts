export type DataSensitivity = "public" | "personal" | "sensitive";

export interface DataPolicy {
  sensitivity: DataSensitivity;
  allowRemoteProviders: boolean;
  redactKeys?: string[];
}

export function sanitizeInputs(
  inputs: Record<string, unknown>,
  policy: DataPolicy,
): Record<string, unknown> {
  const copy = { ...inputs };
  for (const key of policy.redactKeys ?? []) {
    if (key in copy) copy[key] = "[REDACTED]";
  }
  if (policy.sensitivity === "sensitive" && policy.allowRemoteProviders) {
    throw new Error("Sensitive inputs require an explicit local/private workflow.");
  }
  return copy;
}
