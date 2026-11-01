import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const sections = {
  investors: {
    title: "Investors",
    description: "Investor records should include contact details, investment information, verification status, and controlled access to identity documents.",
    note: "The investor table and its security policies are not part of the current confirmed schema. This page intentionally does not collect or display CNIC data until protected storage and access rules are configured.",
  },
  news: {
    title: "News & Updates",
    description: "Prepare official announcements, review drafts, and publish approved updates.",
    note: "The announcement table and draft/publish workflow are not part of the current confirmed schema. No announcements are fabricated here.",
  },
  "audit-logs": {
    title: "Audit Logs",
    description: "Review recorded activity, including who performed an action and when it occurred.",
    note: "An audit log must be written by trusted server-side actions and protected against editing. The current schema has not been confirmed to include this table, so no activity is invented.",
  },
} as const;

type SectionKey = keyof typeof sections;

export default async function CentralWorkspaceSetupPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in sections)) notFound();
  const key = section as SectionKey;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/management/login");

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("id, status")
    .eq("id", user.id)
    .maybeSingle();
  if (!employee || String(employee.status).toLowerCase() !== "active") redirect("/management/login");

  const { data: assignments, error: roleError } = await supabase
    .from("employee_roles")
    .select("roles!inner(name), departments!inner(slug)")
    .eq("employee_id", user.id)
    .eq("departments.slug", "central");
  const allowedRoles = new Set(["CEO", "CO_CEO", "COCEO", "CO-CEO", "MANAGEMENT_HEAD", "MANAGMENT_HEAD", "MANAGEMENT HEAD", "CENTRAL_ADMIN"]);
  const authorized = !roleError && (assignments ?? []).some((assignment: any) => {
    const role = Array.isArray(assignment.roles) ? assignment.roles[0] : assignment.roles;
    return allowedRoles.has(String(role?.name ?? "").trim().toUpperCase());
  });
  if (!authorized) redirect("/management");

  const content = sections[key];
  return (
    <main className="min-h-screen bg-[#F8FAF7] px-4 py-8 text-[#18412F] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/management" className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] transition hover:text-[#18412F]">← Back to central dashboard</Link>
        <section className="mt-6 overflow-hidden rounded-[32px] bg-[#18412F] p-7 text-white sm:p-10">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#D9A55B]">Central Management · Workspace</p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{content.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#D8E4DD]">{content.description}</p>
        </section>
        <section className="mt-6 rounded-[28px] border border-[#E3EAE6] bg-white p-6 sm:p-8">
          <span className="inline-flex rounded-full bg-[#FFF5E5] px-3 py-1.5 text-xs font-extrabold text-[#8A5B19]">Database setup required</span>
          <h2 className="mt-4 text-xl font-black">This workspace is not connected yet</h2>
          <p className="mt-3 text-sm leading-7 text-[#6B7280]">{content.note}</p>
          <p className="mt-4 text-sm leading-7 text-[#6B7280]">The green executive theme and navigation are ready, but create/edit/delete actions should only be enabled after the matching database tables, role permissions, and Row Level Security policies are in place.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/management/departments" className="rounded-full bg-[#18412F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123526]">Departments</Link>
            <Link href="/management/employees" className="rounded-full border border-[#E3EAE6] px-5 py-3 text-sm font-bold text-[#18412F] transition hover:bg-[#F8FAF7]">Employees</Link>
            <Link href="/management/roles" className="rounded-full border border-[#E3EAE6] px-5 py-3 text-sm font-bold text-[#18412F] transition hover:bg-[#F8FAF7]">Roles & Permissions</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
