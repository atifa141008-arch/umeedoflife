import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const instant = false;
export default async function ManagementPage() {
  const supabase = await createClient();

  // 1. Verify the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/management/login");
  }

  // 2. Verify the employee profile
  const { data: employee, error: employeeError } = await supabase
    .from("employee_profiles")
    .select("id, full_name, job_title, status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    employeeError ||
    !employee ||
    employee.status !== "active"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf8] px-6">
        <section className="max-w-lg rounded-3xl border border-[#e3ebe6] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#173f32]">
            Access Pending
          </h1>

          <p className="mt-4 leading-7 text-[#687870]">
            Your account is authenticated, but an active employee
            profile could not be verified. Please contact the
            authorized administrator.
          </p>

          <form action="/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-full bg-[#173f32] px-6 py-3 font-bold text-white hover:bg-[#235746]"
            >
              Sign Out
            </button>
          </form>
        </section>
      </main>
    );
  }

  // 3. Verify assigned central leadership role
  // This query works only after the RLS policy in Step 3 is added.
  const { data: assignments, error: roleError } = await supabase
    .from("employee_roles")
    .select(`
      roles!inner (
        name
      ),
      departments!inner (
        slug
      )
    `)
    .eq("employee_id", user.id)
    .eq("departments.slug", "central");
    if (roleError) {
  console.error("Management role verification failed:", roleError.message);
}

  const allowedRoles = ["CEO", "CO_CEO", "CENTRAL_ADMIN"];

  const hasManagementRole =
    !roleError &&
    (assignments ?? []).some((assignment: any) =>
      allowedRoles.includes(assignment.roles?.name)
    );

  if (!hasManagementRole) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf8] px-6">
        <section className="max-w-lg rounded-3xl border border-[#e3ebe6] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#173f32]">
            Access Denied
          </h1>

          <p className="mt-4 leading-7 text-[#687870]">
            Your account does not have an authorized central
            management role. Please contact the authorized
            administrator.
          </p>

          <form action="/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-full bg-[#173f32] px-6 py-3 font-bold text-white hover:bg-[#235746]"
            >
              Sign Out
            </button>
          </form>
        </section>
      </main>
    );
  }

  // 4. Display the authorized dashboard
  return (
    <main className="min-h-screen bg-[#f8faf8]">
      <header className="border-b border-[#e3ebe6] bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xl font-black text-[#173f32]">
              Umeed of Life
            </p>

            <p className="mt-1 text-sm text-[#687870]">
              Central Management
            </p>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-[#dfe7e2] px-5 py-3 text-sm font-bold text-[#173f32] transition hover:bg-[#f8faf8]"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl bg-[#173f32] p-8 text-white md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-[#d6a65d]">
            Authorized Workspace
          </p>

          <h1 className="mt-4 text-3xl font-black md:text-4xl">
            Welcome, {employee.full_name}
          </h1>

          <p className="mt-3 text-white/75">
            {employee.job_title || "Central Management"}
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Departments", "Manage department operations"],
            ["Employees", "Manage staff and positions"],
            ["Roles & Permissions", "Control authorized access"],
            ["Investors", "Manage approved investor access"],
            ["News & Updates", "Prepare official announcements"],
            ["Audit Logs", "Review recorded activities"],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-3xl border border-[#e3ebe6] bg-white p-6"
            >
              <h2 className="text-lg font-black text-[#173f32]">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#687870]">
                {description}
              </p>

              <span className="mt-5 inline-block text-xs font-bold text-[#b7792b]">
                Setup in progress
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}