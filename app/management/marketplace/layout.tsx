import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MarketplaceManagementShell from "@/components/management/MarketplaceManagementShell";

export default async function MarketplaceManagementLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/management/login");

  const { data: employee } = await supabase.from("employee_profiles")
    .select("id,full_name,status").eq("id", user.id).maybeSingle();
  if (!employee || employee.status !== "active") redirect("/management/login?error=access");

  const { data: assignments, error: roleError } = await supabase.from("employee_roles").select("roles!inner(name),departments!inner(slug)").eq("employee_id", user.id).eq("departments.slug", "central");
  const allowed = ["CEO", "CO_CEO", "CENTRAL_ADMIN"];
  const hasRole = !roleError && (assignments ?? []).some((row: any) => allowed.includes(row.roles?.name));
  if (!hasRole) redirect("/management?error=access");

  return <MarketplaceManagementShell name={employee.full_name || user.email || "Management"}>{children}</MarketplaceManagementShell>;
}
