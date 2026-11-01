import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type CentralRole = "CEO" | "CO_CEO" | "MANAGEMENT_HEAD";
const roleAliases: Record<CentralRole,string[]> = { CEO:["CEO"], CO_CEO:["CO_CEO","COCEO","CO-CEO"], MANAGEMENT_HEAD:["MANAGEMENT_HEAD","MANAGMENT_HEAD","MANAGEMENT HEAD","CENTRAL_ADMIN"] };
export async function requireCentralRole(allowed: CentralRole[]) {
 const session = await createClient();
 const { data:{user}, error } = await session.auth.getUser();
 if (error || !user) return { ok:false as const, status:401, message:"Please sign in." };
 const admin=createAdminClient();
 const {data:profile,error:pe}=await admin.from("employee_profiles").select("id,status,full_name").eq("id",user.id).maybeSingle();
 if(pe || !profile || String(profile.status).toLowerCase()!=="active") return {ok:false as const,status:403,message:"An active employee profile is required."};
 const {data:assignments,error:re}=await admin.from("employee_roles").select("roles!inner(name),departments!inner(slug)").eq("employee_id",user.id).eq("departments.slug","central");
 if(re) return {ok:false as const,status:403,message:"Unable to verify central role."};
 const names=(assignments??[]).map((a:any)=>{const r=Array.isArray(a.roles)?a.roles[0]:a.roles;return String(r?.name??"").trim().toUpperCase().replace(/[\s-]+/g,"_")});
 const role=allowed.find(x=>roleAliases[x].some(a=>names.includes(a.toUpperCase().replace(/[\s-]+/g,"_"))));
 if(!role) return {ok:false as const,status:403,message:"Your role does not have access to this action."};
 return {ok:true as const,userId:user.id,role,profile,admin};
}
export function jsonError(message:string,status:number){return Response.json({error:message},{status});}
