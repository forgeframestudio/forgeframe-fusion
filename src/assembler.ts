import type { FusionRequest, StepResult } from "./types.js";

export interface FusionArtifact {
  name: string;
  kind: "text" | "code" | "data" | "binary-reference";
  content: unknown;
  url?: string;
  mediaType?: string;
  downloadable?: boolean;
}

export interface AssembledResult {
  goal: string;
  artifacts: FusionArtifact[];
  summary: string;
}

export function assemble(request: FusionRequest, results: StepResult[]): AssembledResult {
  const successful = results.filter((r) => !r.error);
  return {
    goal: request.goal,
    artifacts: successful.map((r) => ({
      name: r.stepId,
      kind: typeof r.output === "string" ? "text" : "data",
      content: r.output,
      ...(typeof r.output === "object" && r.output !== null && "url" in r.output ? { url: String((r.output as {url:unknown}).url), downloadable: true } : {}),
      ...(typeof r.output === "object" && r.output !== null && "mediaType" in r.output ? { mediaType: String((r.output as {mediaType:unknown}).mediaType) } : {}),
    })),
    summary: `Assembled ${successful.length} successful specialist result(s) for: ${request.goal}`,
  };
}
