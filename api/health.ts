import { prototypeEntitlement } from "../src/entitlements.js";

export default function handler(_req:any,res:any){
  res.status(200).json({
    service:"ForgeFrame Fusion",
    status:"online",
    version:"0.4.0",
    runtime:"server",
    entitlement:prototypeEntitlement,
    capabilities:{accounts:false,cloudProjects:false,billing:false}
  });
}
