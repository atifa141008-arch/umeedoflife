import { requireCentralRole, jsonError } from "@/lib/supabase/central-finance-auth";
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]);if(!auth.ok)return jsonError(auth.message,auth.status);
 const {id}=await params;const {data:submission,error}=await auth.admin.from("investment_submissions").select("proof_path").eq("id",id).maybeSingle();if(error||!submission)return jsonError("Payment proof was not found.",404);
 const {data,error:signError}=await auth.admin.storage.from("investment-proofs").createSignedUrl(submission.proof_path,90);if(signError||!data?.signedUrl)return jsonError("A secure preview link could not be created.",500);return Response.json({url:data.signedUrl});
}
