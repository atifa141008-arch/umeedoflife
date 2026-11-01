import { requireCentralRole, jsonError } from "@/lib/supabase/central-finance-auth";
export async function GET(){
 const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]); if(!auth.ok)return jsonError(auth.message,auth.status);
 const {data,error}=await auth.admin.from("investment_submissions").select("id,investor_id,account_id,amount,currency,reference_number,payment_date,note,proof_path,status,review_note,reviewed_by,reviewed_at,created_at,investor_profiles!inner(full_name,email),investment_accounts!inner(label,bank_name,account_title,account_number)").order("created_at",{ascending:false});
 if(error)return jsonError("Submissions could not be loaded. Apply the SQL migration.",500);
 return Response.json({submissions:data??[]});
}
