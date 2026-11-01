import { NextRequest } from "next/server";
import { requireCentralRole, jsonError } from "@/lib/supabase/central-finance-auth";
export async function GET(){
 const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]);if(!auth.ok)return jsonError(auth.message,auth.status);
 const [{data:departments,error:de},{data:entries,error:ee}] = await Promise.all([
  auth.admin.from("departments").select("id,name,slug,status").order("name"),
  auth.admin.from("department_financial_entries").select("id,department_id,entry_type,amount,currency,note,entry_date,created_at,departments!inner(name,slug)").order("entry_date",{ascending:false})
 ]);
 if(de||ee)return jsonError("Department financial figures could not be loaded. Apply the SQL migration and check schema.",500);
 const rows=(departments??[]).map((d:any)=>{const items=(entries??[]).filter((e:any)=>e.department_id===d.id);const sum=(type:string)=>items.filter((e:any)=>e.entry_type===type).reduce((n:number,e:any)=>n+Number(e.amount||0),0);return {id:d.id,name:d.name,slug:d.slug,status:d.status,income:sum("income"),outgoing:sum("expense"),worth:(items.filter((e:any)=>e.entry_type==="valuation").sort((a:any,b:any)=>String(b.entry_date).localeCompare(String(a.entry_date)))[0]?.amount ?? 0),currency:"PKR"}});
 return Response.json({departments:rows,entries:entries??[]});
}
export async function POST(req:NextRequest){
 const auth=await requireCentralRole(["MANAGEMENT_HEAD"]);if(!auth.ok)return jsonError(auth.message,auth.status);
 let b:any;try{b=await req.json()}catch{return jsonError("Invalid request body.",400)}
 const department_id=String(b.department_id??""), entry_type=String(b.entry_type??""), amount=Number(b.amount), note=String(b.note??"").trim(), entry_date=String(b.entry_date??new Date().toISOString().slice(0,10));
 if(!department_id||!["income","expense","valuation"].includes(entry_type)||!Number.isFinite(amount)||amount<=0||!note)return jsonError("Department, type, positive amount and explanation are required.",400);
 const {data,error}=await auth.admin.from("department_financial_entries").insert({department_id,entry_type,amount,currency:"PKR",note,entry_date,created_by:auth.userId}).select("id").single();
 if(error)return jsonError("Financial entry could not be saved: "+error.message,500);
 await auth.admin.from("central_audit_logs").insert({actor_id:auth.userId,action:"department_finance.created",entity_type:"department_financial_entry",entity_id:data.id,metadata:{department_id,entry_type,amount}});
 return Response.json({id:data.id},{status:201});
}
