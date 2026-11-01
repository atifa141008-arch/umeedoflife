import { NextRequest } from "next/server";
import { requireCentralRole, jsonError } from "@/lib/supabase/central-finance-auth";
export async function GET(){
 const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]); if(!auth.ok)return jsonError(auth.message,auth.status);
 const {data,error}=await auth.admin.from("investment_accounts").select("id,label,bank_name,account_title,account_number,iban,instructions,is_active,created_by,created_at").order("created_at",{ascending:false});
 if(error)return jsonError("Investment accounts could not be loaded. Apply the SQL migration.",500);
 return Response.json({accounts:data??[]});
}
export async function POST(req:NextRequest){
 const auth=await requireCentralRole(["CEO","CO_CEO"]); if(!auth.ok)return jsonError(auth.message,auth.status);
 let b:any;try{b=await req.json()}catch{return jsonError("Invalid request body.",400)}
 const label=String(b.label??"").trim(), bank_name=String(b.bank_name??"").trim(), account_title=String(b.account_title??"").trim(), account_number=String(b.account_number??"").trim(), iban=String(b.iban??"").trim(), instructions=String(b.instructions??"").trim();
 if(!label||!bank_name||!account_title||!account_number)return jsonError("Label, bank, account title and account number are required.",400);
 const {data,error}=await auth.admin.from("investment_accounts").insert({label,bank_name,account_title,account_number,iban:iban||null,instructions:instructions||null,is_active:true,created_by:auth.userId}).select("id,label,bank_name,account_title,account_number,iban,instructions,is_active,created_by,created_at").single();
 if(error)return jsonError("Account could not be saved: "+error.message,500);
 await auth.admin.from("central_audit_logs").insert({actor_id:auth.userId,action:"investment_account.created",entity_type:"investment_account",entity_id:data.id,metadata:{label,bank_name}});
 return Response.json({account:data},{status:201});
}
