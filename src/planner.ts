import type { Capability, ExecutionPlan, FusionRequest } from "./types.js";

const infer = (goal: string): Capability[] => {
  const g = goal.toLowerCase();
  const caps = new Set<Capability>(["reasoning"]);
  if (/image|photo|art|portrait|caricature/.test(g)) caps.add("image.transform");
  if (/face|identity|likeness|reference/.test(g)) caps.add("identity.preserve");
  if (/code|app|software|api|game|unreal/.test(g)) {
    caps.add("code.generate");
    caps.add("code.review");
    caps.add("test.execute");
    caps.add("artifact.package");
  }
  if (/research|find|search/.test(g)) caps.add("research");
  if (/voice|speak|talk|audio/.test(g)) {
    caps.add("audio.transcribe");
    caps.add("voice.synthesize");
  }
  return [...caps];
};

export function plan(request: FusionRequest): ExecutionPlan {
  const capabilities = request.requiredCapabilities?.length
    ? request.requiredCapabilities
    : infer(request.goal);

  const steps = capabilities.map((capability, index) => ({
    id: `step-${index + 1}`,
    capability,
    instruction: `Complete the ${capability} portion of this outcome: ${request.goal}`,
    dependsOn: capability === "reasoning" ? [] : ["step-1"],
  }));

  return { goal: request.goal, steps };
}
