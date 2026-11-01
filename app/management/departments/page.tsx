import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";

export const instant = false;

export default async function DepartmentsPage() {
  const supabase = await createClient();

  // Baqi existing code bilkul waise hi rehne dein.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/management/login");
  }

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
    (assignments ?? []).some((assignment: any) =>
      allowedRoles.includes(assignment.roles?.name)
    );

  if (!authorized) {
    redirect("/management");
  }

  const { data: departments, error } = await supabase
    .from("departments")
    .select("id, name, slug, status")
    .order("name");

  return (
    <main className="min-h-screen bg-[#F8FAF7]">
      <header className="border-b border-[#E3EAE6] bg-white px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#18412F]">
              Department Management
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Umeed of Life Central Administration
            </p>
          </div>

          <Link
            href="/management"
            className="rounded-full border border-[#E3EAE6] px-5 py-3 text-sm font-bold text-[#18412F]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 rounded-3xl bg-[#18412F] p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9A55B]">
            Authorized Workspace
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Welcome, {employee.full_name}
          </h2>

          <p className="mt-3 text-white/75">
            View your organization&apos;s departments and their current status.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Departments could not be loaded. Please check the database
            permissions.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(departments ?? []).map((department) => (
              <article
                key={department.id}
                className="rounded-3xl border border-[#E3EAE6] bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-black text-[#18412F]">
                  {department.name}
                </h3>

                <p className="mt-2 text-sm text-[#6B7280]">
                  Department: {department.slug}
                </p>

                <span className="mt-5 inline-block rounded-full bg-[#EAF1EC] px-4 py-2 text-xs font-bold capitalize text-[#18412F]">
                  {department.status}
                </span>
              </article>
            ))}

            {!departments?.length && (
              <p className="text-[#6B7280]">
                No departments are available.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}