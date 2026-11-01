import { NextRequest } from "next/server";
import { requireCentralRole, jsonError } from "@/lib/supabase/central-finance-auth";
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 const auth=await requireCentralRole(["MANAGEMENT_HEAD"]); if(!auth.ok)return jsonError(auth.message,auth.status);
 const {id}=await params; let b:any;try{b=await req.json()}catch{return jsonError("Invalid request body.",400)}
 const decision=String(b.decision??""); const review_note=String(b.review_note??"").trim();
 if(!["approve","reject"].includes(decision))return jsonError("Decision must be approve or reject.",400);
 if(decision==="reject"&&!review_note)return jsonError("Add a reason before rejecting a payment.",400);
 const {data,error}=await auth.admin.rpc("review_investment_submission",{p_submission_id:id,p_decision:decision,p_review_note:review_note||null,p_reviewer_id:auth.userId});
 if(error)return jsonError("Review failed: "+error.message,400);
 await auth.admin.from("central_audit_logs").insert({actor_id:auth.userId,action:decision==="approve"?"investment.approved":"investment.rejected",entity_type:"investment_submission",entity_id:id,metadata:{review_note}});
 return Response.json({result:data});
}
