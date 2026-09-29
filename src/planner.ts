import type { Capability, ExecutionPlan, FusionRequest } from "./types.js";

const infer = (goal: string): Capability[] => {
  const g = goal.toLowerCase();
  const caps = new Set<Capability>(["reasoning"]);
  if (/image|photo|art|portrait|caricature/.test(g)) caps.add("image.transform");
  if (/face|identity|likeness|reference/.test(g)) caps.add("identity.preserve");
  if (/code|app|software|api|game|unreal/.test(g)) {
    caps.add("code.generate"); caps.add("code.review"); caps.add("test.execute"); caps.add("artifact.package");
  }
  if (/research|find|search/.test(g)) caps.add("research");
  if (/voice|speak|talk|audio/.test(g)) { caps.add("audio.transcribe"); caps.add("voice.synthesize"); }
  return [...caps];
};

export function plan(request: FusionRequest): ExecutionPlan {
  const capabilities = request.requiredCapabilities?.length ? request.requiredCapabilities : infer(request.goal);
  const ids = new Map<Capability,string>();
  capabilities.forEach((c,i)=>ids.set(c,`step-${i+1}`));
  const reasoning = ids.get("reasoning");
  const dep = (c: Capability): string[] => {
    const d: string[] = [];
    if (reasoning && c !== "reasoning") d.push(reasoning);
    if (c === "code.review" && ids.get("code.generate")) d.push(ids.get("code.generate")!);
    if (c === "test.execute") {
      if (ids.get("code.review")) d.push(ids.get("code.review")!);
      else if (ids.get("code.generate")) d.push(ids.get("code.generate")!);
    }
    if (c === "artifact.package") {
      if (ids.get("test.execute")) d.push(ids.get("test.execute")!);
      else if (ids.get("code.generate")) d.push(ids.get("code.generate")!);
    }
    if (c === "identity.preserve" && ids.get("image.transform")) d.push(ids.get("image.transform")!);
    return [...new Set(d)];
  };
  return { goal: request.goal, steps: capabilities.map((capability,index)=>({
    id:`step-${index+1}`, capability,
    instruction:`Complete the ${capability} portion of this outcome: ${request.goal}`,
    dependsOn: dep(capability),
  })) };
}
