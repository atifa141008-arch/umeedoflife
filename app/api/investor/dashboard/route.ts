import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function GET(){
 const session=await createClient();const {data:{user},error:ue}=await session.auth.getUser();if(ue||!user)return Response.json({error:"Please sign in."},{status:401});
 const admin=createAdminClient();const {data:investor,error:ie}=await admin.from("investor_profiles").select("id,full_name,email,phone,status").eq("auth_user_id",user.id).maybeSingle();if(ie||!investor||investor.status!=="active")return Response.json({error:"Investor profile is not active."},{status:403});
 const [{data:submissions,error:se},{data:ledger,error:le},{data:accounts,error:ae},{data:dept,error:de},{data:permissionRows,error:pe},{data:allApproved,error:allError}] = await Promise.all([
  admin.from("investment_submissions").select("id,amount,currency,reference_number,payment_date,note,status,review_note,created_at,investment_accounts(label,bank_name,account_title,account_number,iban,instructions)").eq("investor_id",investor.id).order("created_at",{ascending:false}),
  admin.from("investor_wallet_ledger").select("id,amount,entry_type,note,created_at").eq("investor_id",investor.id).order("created_at",{ascending:false}),
  admin.from("investment_accounts").select("id,label,bank_name,account_title,account_number,iban,instructions").eq("is_active",true).order("created_at",{ascending:false}),
  admin.from("department_financial_entries").select("entry_type,amount,department_id,entry_date,departments!inner(name,slug)"),
  admin.from("investor_access_permissions").select("permission_key,enabled").eq("investor_id",investor.id),
  admin.from("investment_submissions").select("amount").eq("status","approved")
 ]);
 if(se||le||ae||de||pe||allError)return Response.json({error:"Investor dashboard data is not ready. Contact management."},{status:500});
 const access=Object.fromEntries((permissionRows??[]).map((p:any)=>[p.permission_key,p.enabled]));for(const key of ["wallet_summary","department_finances","payment_history","submit_investment"])if(!(key in access))access[key]=true;
 const balance=(ledger??[]).reduce((sum:number,row:any)=>sum+(row.entry_type==="credit"?Number(row.amount):-Number(row.amount)),0);
 const approved=(submissions??[]).filter((s:any)=>s.status==="approved").reduce((sum:number,s:any)=>sum+Number(s.amount),0);
 const pending=(submissions??[]).filter((s:any)=>s.status==="pending").reduce((sum:number,s:any)=>sum+Number(s.amount),0);
 const departments=Array.from(new Map((dept??[]).map((x:any)=>[x.department_id??x.departments?.slug,x.departments?.name])).entries()).map(([id,name])=>{const es=(dept??[]).filter((x:any)=>(x.department_id??x.departments?.slug)===id);const sum=(type:string)=>es.filter((e:any)=>e.entry_type===type).reduce((n:number,e:any)=>n+Number(e.amount),0);const vals=es.filter((e:any)=>e.entry_type==="valuation").sort((a:any,b:any)=>String(b.entry_date).localeCompare(String(a.entry_date)));return {id,name,income:sum("income"),outgoing:sum("expense"),worth:Number(vals[0]?.amount??0)}});
 const totalInvestmentsReceived=(allApproved??[]).reduce((sum:number,row:any)=>sum+Number(row.amount||0),0);const totalCompanyIncome=(dept??[]).filter((x:any)=>x.entry_type==="income").reduce((sum:number,row:any)=>sum+Number(row.amount||0),0);const totalCompanyOutgoing=(dept??[]).filter((x:any)=>x.entry_type==="expense").reduce((sum:number,row:any)=>sum+Number(row.amount||0),0);
 return Response.json({investor,access,walletBalance:access.wallet_summary?balance:null,approvedInvestment:access.wallet_summary?approved:null,pendingInvestment:access.wallet_summary?pending:null,totalInvestmentsReceived:access.wallet_summary?totalInvestmentsReceived:null,totalCompanyIncome:access.department_finances?totalCompanyIncome:null,totalCompanyOutgoing:access.department_finances?totalCompanyOutgoing:null,submissions:access.payment_history?(submissions??[]):[],ledger:access.wallet_summary?(ledger??[]):[],accounts:access.submit_investment?(accounts??[]):[],departments:access.department_finances?departments:[]});
}
