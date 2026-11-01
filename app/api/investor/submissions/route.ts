import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(req:NextRequest){
 const session=await createClient();const {data:{user},error:ue}=await session.auth.getUser();if(ue||!user)return Response.json({error:"Please sign in."},{status:401});
 const admin=createAdminClient();const {data:investor,error:ie}=await admin.from("investor_profiles").select("id,status").eq("auth_user_id",user.id).maybeSingle();if(ie||!investor||investor.status!=="active")return Response.json({error:"Active investor access is required."},{status:403});const {data:permission}=await admin.from("investor_access_permissions").select("enabled").eq("investor_id",investor.id).eq("permission_key","submit_investment").maybeSingle();if(permission?.enabled===false)return Response.json({error:"Management has not enabled new investment submissions for your account."},{status:403});
 const form=await req.formData();const account_id=String(form.get("account_id")??""), amount=Number(form.get("amount")), reference_number=String(form.get("reference_number")??"").trim(), payment_date=String(form.get("payment_date")??""), note=String(form.get("note")??"").trim(), file=form.get("proof");
 if(!account_id||!Number.isFinite(amount)||amount<=0||!reference_number||!payment_date||!(file instanceof File))return Response.json({error:"Account, amount, reference, payment date and payment screenshot/file are required."},{status:400});
 if(file.size>5*1024*1024)return Response.json({error:"Proof file must be 5 MB or smaller."},{status:400});
 const allowed=["image/jpeg","image/png","image/webp","application/pdf"];if(!allowed.includes(file.type))return Response.json({error:"Use JPG, PNG, WEBP or PDF proof."},{status:400});
 const {data:account,error:ae}=await admin.from("investment_accounts").select("id").eq("id",account_id).eq("is_active",true).maybeSingle();if(ae||!account)return Response.json({error:"Selected account is not active."},{status:400});
 const ext=file.type==="application/pdf"?"pdf":file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";const path=`${investor.id}/${crypto.randomUUID()}.${ext}`;
 const {error:uploadError}=await admin.storage.from("investment-proofs").upload(path,file,{contentType:file.type,upsert:false});if(uploadError)return Response.json({error:"Proof upload failed. Ensure the private investment-proofs bucket exists."},{status:500});
 const {data,error}=await admin.from("investment_submissions").insert({investor_id:investor.id,account_id,amount,currency:"PKR",reference_number,payment_date,note:note||null,proof_path:path,status:"pending"}).select("id,status,amount,created_at").single();
 if(error){await admin.storage.from("investment-proofs").remove([path]);return Response.json({error:"Submission could not be saved: "+error.message},{status:500});}
 await admin.from("central_audit_logs").insert({actor_id:user.id,action:"investment.submitted",entity_type:"investment_submission",entity_id:data.id,metadata:{amount,reference_number}});
 return Response.json({submission:data},{status:201});
}
