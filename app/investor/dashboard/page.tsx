import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import InvestorDashboardClient from "@/components/investor/InvestorDashboardClient";
export const instant = false;
export default async function InvestorDashboardPage(){const supabase=await createClient();const {data:{user},error}=await supabase.auth.getUser();if(error||!user)redirect("/investor/login");const admin=createAdminClient();const {data:investor}=await admin.from("investor_profiles").select("id,status").eq("auth_user_id",user.id).maybeSingle();if(!investor||investor.status!=="active")redirect("/investor/login");return <InvestorDashboardClient/>}
