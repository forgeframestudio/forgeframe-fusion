import type { Capability, ExecutionPlan, FusionRequest } from "./types.js";

const infer = (goal: string): Capability[] => {
  const g = goal.toLowerCase();
  const caps = new Set<Capability>(["reasoning"]);
  if (/image|photo|art|portrait|caricature/.test(g)) caps.add("image.transform");
  if (/face|identity|likeness|reference/.test(g)) caps.add("identity.preserve");
  if (/verify|check|accurate|preserve/.test(g)) caps.add("vision.analysis");
  if (/code|app|software|api|game/.test(g)) caps.add("code.generate");
  if (/research|find|search/.test(g)) caps.add("research");
  return [...caps];
};

export function plan(request: FusionRequest): ExecutionPlan {
  const capabilities = request.requiredCapabilities?.length
    ? request.requiredCapabilities
    : infer(request.goal);

  return {
    goal: request.goal,
    steps: capabilities.map((capability, index) => ({
      id: `step-${index + 1}`,
      capability,
      instruction: `Apply ${capability} toward: ${request.goal}`,
      dependsOn: index === 0 ? [] : ["step-1"],
    })),
  };
}
