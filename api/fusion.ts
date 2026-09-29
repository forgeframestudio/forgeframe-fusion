import { ForgeFrameFusion } from "../src/fusion.js";
import { CapabilityRegistry } from "../src/registry.js";
import { createAdapterRunner } from "../src/adapters/adapter-runner.js";
import type { ProviderAdapter } from "../src/adapters/adapter.js";
import type { Capability, ProviderProfile } from "../src/types.js";

const capabilities: Capability[]=["reasoning","vision.analysis","image.generate","image.transform","identity.preserve","pose.control","segment","upscale","code.generate","code.review","research","audio.generate","audio.transcribe","voice.synthesize","video.generate","threeD.generate","test.execute","artifact.package","video.edit","artifact.store"];

class RuntimeAdapter implements ProviderAdapter {
  profile(): ProviderProfile { return {id:"fusion-runtime",capabilities,quality:.9,estimatedLatencyMs:250,estimatedCostUsd:0,available:true}; }
  supports(c:Capability){return capabilities.includes(c)}
  async healthcheck(){return true}
  async run(instruction:string, context:{inputs:Record<string,unknown>;dependencies:Record<string,unknown>}) {
    return {status:"planned",instruction,receivedInputs:Object.keys(context.inputs),dependencyCount:Object.keys(context.dependencies).length,note:"Runtime orchestration is online. External generative provider adapters are not configured on this deployment yet."};
  }
}

export default async function handler(req:any,res:any){
  res.setHeader("Access-Control-Allow-Origin","*"); res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="POST") return res.status(405).json({error:"POST required"});
  try{
    const body=typeof req.body==="string"?JSON.parse(req.body):req.body||{};
    if(!body.goal) return res.status(400).json({error:"goal is required"});
    const registry=new CapabilityRegistry(); const adapter=new RuntimeAdapter(); registry.register(adapter.profile());
    const fusion=new ForgeFrameFusion(registry,createAdapterRunner([adapter]));
    const result=await fusion.run({goal:String(body.goal),inputs:body.inputs||{},deliverables:body.deliverables||[]});
    return res.status(200).json(result);
  }catch(error){return res.status(500).json({error:error instanceof Error?error.message:"Fusion runtime failed"});}
}