import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InvestorManagementClient from "@/components/management/InvestorManagementClient";

export default async function InvestorsWorkspacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/management/login");
  const { data: employee } = await supabase.from("employee_profiles").select("full_name,status").eq("id", user.id).maybeSingle();
  if (!employee || String(employee.status).toLowerCase() !== "active") redirect("/management/login");
  const { data: roles, error } = await supabase.from("employee_roles").select("roles!inner(name),departments!inner(slug)").eq("employee_id", user.id).eq("departments.slug", "central");
  const allowed = new Set(["CEO","CO_CEO","COCEO","CO-CEO","MANAGEMENT_HEAD","MANAGMENT_HEAD","CENTRAL_ADMIN"]);
  const authorized = !error && (roles ?? []).some((x:any) => { const r=Array.isArray(x.roles)?x.roles[0]:x.roles; return allowed.has(String(r?.name??"").trim().toUpperCase()); });
  if (!authorized) redirect("/management");
  return <InvestorManagementClient currentUserName={employee.full_name || user.email || "Management"} />;
}
