export type Capability =
  | "reasoning" | "vision.analysis" | "image.generate" | "image.transform"
  | "identity.preserve" | "pose.control" | "segment" | "upscale"
  | "code.generate" | "code.review" | "research" | "audio.generate"
  | "audio.transcribe" | "voice.synthesize" | "video.generate" | "threeD.generate"
  | "test.execute" | "artifact.package";

export interface Constraints {
  maxCostUsd?: number;
  maxLatencyMs?: number;
  requireLocal?: boolean;
  preserve?: string[];
}

export interface FusionRequest {
  goal: string;
  requiredCapabilities?: Capability[];
  constraints?: Constraints;
  inputs?: Record<string, unknown>;
}

export interface ProviderProfile {
  id: string;
  capabilities: Capability[];
  quality: number;
  estimatedLatencyMs: number;
  estimatedCostUsd: number;
  available: boolean;
  local?: boolean;
}

export interface PlanStep {
  id: string;
  capability: Capability;
  instruction: string;
  dependsOn: string[];
}

export interface ExecutionPlan { goal: string; steps: PlanStep[]; }

export interface StepResult {
  stepId: string;
  capability?: Capability;
  providerId: string;
  output: unknown;
  latencyMs: number;
  error?: string;
}

export interface VerificationResult {
  passed: boolean;
  score: number;
  failures: string[];
  failedStepIds?: string[];
}
