import { NextRequest } from "next/server";
import { requireCentralRole, jsonError } from "@/lib/supabase/central-finance-auth";

export async function GET(){
 const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]); if(!auth.ok)return jsonError(auth.message,auth.status);
 const {data,error}=await auth.admin.from("investor_profiles").select("id,auth_user_id,full_name,email,phone,cnic_number,address,status,created_at").order("created_at",{ascending:false});
 if(error)return jsonError("Investor records could not be loaded. Apply the investor SQL migration and check policies.",500);
 const {data:permissions, error:permissionError}=await auth.admin.from("investor_access_permissions").select("investor_id,permission_key,enabled");
 if(permissionError)return jsonError("Investor access permissions could not be loaded.",500);
 const investors=(data??[]).map((i:any)=>({...i,access:Object.fromEntries((permissions??[]).filter((p:any)=>p.investor_id===i.id).map((p:any)=>[p.permission_key,p.enabled]))}));
 return Response.json({investors});
}
export async function POST(req:NextRequest){
 const auth=await requireCentralRole(["CEO","CO_CEO","MANAGEMENT_HEAD"]); if(!auth.ok)return jsonError(auth.message,auth.status);
 let body:any; try{body=await req.json()}catch{return jsonError("Invalid request body.",400)}
 const full_name=String(body.full_name??"").trim(), email=String(body.email??"").trim().toLowerCase(), phone=String(body.phone??"").trim(), cnic_number=String(body.cnic_number??"").trim(), address=String(body.address??"").trim();
 if(!full_name||!email||!phone||!cnic_number||!address)return jsonError("Name, email, phone, CNIC and address are required.",400);
 if(!/^\S+@\S+\.\S+$/.test(email))return jsonError("Enter a valid email address.",400);
 if(!/^[0-9-]{13,15}$/.test(cnic_number))return jsonError("Enter CNIC in digits or XXXXX-XXXXXXX-X format.",400);
 const {data:invited,error:inviteError}=await auth.admin.auth.admin.inviteUserByEmail(email,{data:{full_name,account_type:"investor"}});
 if(inviteError||!invited.user)return jsonError(inviteError?.message||"Investor invitation could not be created.",400);
 const {data,error}=await auth.admin.from("investor_profiles").insert({auth_user_id:invited.user.id,full_name,email,phone,cnic_number,address,status:"active",created_by:auth.userId}).select("id,auth_user_id,full_name,email,phone,cnic_number,address,status,created_at").single();
 if(error){await auth.admin.auth.admin.deleteUser(invited.user.id);return jsonError("Investor record could not be saved: "+error.message,500)}
 await auth.admin.from("investor_access_permissions").upsert(["wallet_summary","department_finances","payment_history","submit_investment"].map(permission_key=>({investor_id:data.id,permission_key,enabled:true,updated_by:auth.userId})),{onConflict:"investor_id,permission_key"});
 await auth.admin.from("central_audit_logs").insert({actor_id:auth.userId,action:"investor.created",entity_type:"investor",entity_id:data.id,metadata:{email}});
 return Response.json({investor:data,message:"Investor created and invitation email sent."},{status:201});
}
