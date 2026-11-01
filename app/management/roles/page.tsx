import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";

export const instant = false;

export default async function RolesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/management/login");

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("full_name, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!employee || employee.status !== "active") {
    redirect("/management/login");
  }

  const { data: assignments, error: roleError } = await supabase
    .from("employee_roles")
    .select(`
      roles!inner(name),
      departments!inner(slug)
    `)
    .eq("employee_id", user.id)
    .eq("departments.slug", "central");

  const allowedRoles = ["CEO", "CO_CEO", "COCEO", "CO-CEO", "MANAGEMENT_HEAD", "MANAGMENT_HEAD", "MANAGEMENT HEAD", "CENTRAL_ADMIN"];

  const authorized =
    !roleError &&
    (assignments ?? []).some((item: any) =>
      allowedRoles.includes(item.roles?.name)
    );

  if (!authorized) redirect("/management");

  const { data: roles, error } = await supabase
    .from("roles")
    .select("id, name, description")
    .order("name");

  const { data: permissions, error: permissionsError } =
    await supabase
      .from("permissions")
      .select("id, permission_key, description")
      .order("permission_key");

  const { data: rolePermissions, error: rolePermissionsError } =
    await supabase
      .from("role_permissions")
      .select("role_id, permission_id");
      console.log("Role permissions:", rolePermissions);
      console.log("Role permissions error:", rolePermissionsError);
      console.log("Permissions error:", permissionsError);

  return (
    <main className="min-h-screen bg-[#F8FAF7]">
      <header className="border-b border-[#E3EAE6] bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#18412F]">
              Roles & Permissions
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Central Administration
            </p>
          </div>

          <Link
            href="/management"
            className="rounded-full border border-[#E3EAE6] px-5 py-3 text-sm font-bold text-[#18412F]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-[#18412F] p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9A55B]">
            Authorized Workspace
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Welcome, {employee.full_name}
          </h2>
          <p className="mt-3 text-white/75">
            Review organizational roles and assigned permissions.
          </p>
        </div>

        {error || permissionsError || rolePermissionsError ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load role information. Check the database
            permissions and table policies.
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {(roles ?? []).map((role) => {
              const assignedIds = (rolePermissions ?? [])
                .filter((item) => item.role_id === role.id)
                .map((item) => item.permission_id);

              const assignedPermissions = (permissions ?? []).filter(
                (permission) => assignedIds.includes(permission.id)
              );

              return (
                <article
                  key={role.id}
                  className="rounded-3xl border border-[#E3EAE6] bg-white p-6"
                >
                  <h3 className="text-xl font-black text-[#18412F]">
                    {role.name}
                  </h3>

                  <p className="mt-2 text-sm text-[#6B7280]">
                    {role.description || "No description provided."}
                  </p>

                  <h4 className="mt-5 font-bold text-[#18412F]">
                    Assigned Permissions ({assignedPermissions.length})
                  </h4>

                  {assignedPermissions.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {assignedPermissions.map((permission) => (
                        <span
                          key={permission.id}
                          className="rounded-full bg-[#EAF1EC] px-3 py-2 text-xs font-semibold text-[#18412F]"
                        >
                          {permission.permission_key}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[#6B7280]">
                      No permissions assigned.
                    </p>
                  )}
                </article>
              );
            })}

            {!roles?.length && (
              <p className="text-[#6B7280]">No roles found.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}