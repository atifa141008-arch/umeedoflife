import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";

export const instant = false;
export default async function EmployeesPage() {
  const supabase = await createClient();

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

  const { data: employees, error } = await supabase
    .from("employee_profiles")
    .select("id, full_name, employee_code, job_title, status")
    .order("full_name");

  return (
    <main className="min-h-screen bg-[#F8FAF7]">
      <header className="border-b border-[#E3EAE6] bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#18412F]">
              Employee Management
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Central Administration
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

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-[#18412F] p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-[#D9A55B]">
            Authorized Workspace
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Welcome, {employee.full_name}
          </h2>
          <p className="mt-3 text-white/75">
            View employee profiles and their current status.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-[#E3EAE6] bg-white">
          {error ? (
            <p className="p-6 text-red-700">
              Employees could not be loaded. Check database permissions.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#edf3ee] text-[#18412F]">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Employee Code</th>
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {(employees ?? []).map((item) => (
                  <tr key={item.id} className="border-t border-[#E3EAE6]">
                    <td className="p-4 font-bold text-[#18412F]">
                      {item.full_name}
                    </td>
                    <td className="p-4 text-[#6B7280]">
                      {item.employee_code || "—"}
                    </td>
                    <td className="p-4 text-[#6B7280]">
                      {item.job_title || "—"}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#EAF1EC] px-3 py-2 text-xs font-bold capitalize text-[#18412F]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {!employees?.length && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-[#6B7280]">
                      No employee profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}