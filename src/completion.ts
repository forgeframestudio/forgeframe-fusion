import type { AssembledResult } from "./assembler.js";
import type { VerificationResult } from "./types.js";

export type CompletionStatus = "complete" | "blocked" | "incomplete";

export interface CompletionReport {
  status: CompletionStatus;
  blockers: string[];
  summary: string;
}

export function completionReport(assembled: AssembledResult, verification: VerificationResult): CompletionReport {
  if (verification.passed) return { status: "complete", blockers: [], summary: assembled.summary };
  const blockers = verification.failures.length ? verification.failures : ["Verification did not pass."];
  return { status: assembled.artifacts.length ? "incomplete" : "blocked", blockers, summary: assembled.summary };
}
