import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type LeaderKind = "CEO" | "CO_CEO" | "MANAGEMENT_HEAD";

const leaderConfig: Record<LeaderKind, { title: string; subtitle: string; welcome: string; allowedRoles: string[]; badge: string }> = {
  CEO: { title: "CEO Dashboard", subtitle: "Central Leadership · Chief Executive Officer", welcome: "Organization overview", allowedRoles: ["CEO"], badge: "Executive leadership" },
  CO_CEO: { title: "Co-CEO Dashboard", subtitle: "Central Leadership · Co-Chief Executive Officer", welcome: "Organization overview", allowedRoles: ["CO_CEO", "COCEO", "CO-CEO"], badge: "Executive leadership" },
  MANAGEMENT_HEAD: { title: "Management Head Dashboard", subtitle: "Central Management · Management Head", welcome: "Management operations", allowedRoles: ["MANAGEMENT_HEAD", "MANAGMENT_HEAD", "MANAGEMENT HEAD", "CENTRAL_ADMIN"], badge: "Central management" },
};

const workspaces = [
  { title: "Departments", description: "Activate, pause, or review each department and its status.", href: "/management/departments", icon: "▤", status: "Open workspace" },
  { title: "Employees", description: "Manage employee profiles, teams, department assignments, and status.", href: "/management/employees", icon: "♙", status: "Open workspace" },
  { title: "Roles & Permissions", description: "Review roles and manage access permissions.", href: "/management/roles", icon: "◇", status: "Open workspace" },
  { title: "Investors", description: "Investor records and confidential identity details.", href: "/management/workspace/investors", icon: "◉", status: "Workspace setup required" },
  { title: "News & Updates", description: "Prepare and manage official announcements.", href: "/management/workspace/news", icon: "▧", status: "Workspace setup required" },
  { title: "Audit Logs", description: "Review recorded management activities and changes.", href: "/management/workspace/audit-logs", icon: "≡", status: "Workspace setup required" },
];

function normalizeRole(value: unknown) { return String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_"); }

export default async function CentralLeadershipDashboard({ kind }: { kind: LeaderKind }) {
  const config = leaderConfig[kind];
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/management/login");

  const { data: employee, error: employeeError } = await supabase.from("employee_profiles").select("id, full_name, job_title, status").eq("id", user.id).maybeSingle();
  if (employeeError || !employee || String(employee.status).toLowerCase() !== "active") {
    return <AccessMessage title="Access pending" message="An active management profile could not be verified. Contact the authorized account administrator." />;
  }

  const { data: assignments, error: roleError } = await supabase.from("employee_roles").select("roles!inner(name), departments!inner(slug)").eq("employee_id", user.id).eq("departments.slug", "central");
  const roleNames = (assignments ?? []).map((assignment: any) => {
    const role = Array.isArray(assignment.roles) ? assignment.roles[0] : assignment.roles;
    return normalizeRole(role?.name);
  });
  if (roleError || !roleNames.some((role) => config.allowedRoles.map(normalizeRole).includes(role))) {
    return <AccessMessage title="Access denied" message={`This page is reserved for ${config.title.replace(" Dashboard", "")}. Your central role could not be verified.`} />;
  }

  const [departments, employees, vendors, orders] = await Promise.all([
    supabase.from("departments").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("employee_profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("marketplace_vendors").select("id", { count: "exact", head: true }).eq("application_status", "pending"),
    supabase.from("marketplace_orders").select("id", { count: "exact", head: true }).in("status", ["placed", "confirmed", "packed", "shipped", "out_for_delivery"]),
  ]);
  const metrics = [
    { label: "Active departments", value: departments.error ? "—" : String(departments.count ?? 0), note: "Current department records", icon: "▤" },
    { label: "Active employees", value: employees.error ? "—" : String(employees.count ?? 0), note: "Active employee profiles", icon: "♙" },
    { label: "Vendor applications", value: vendors.error ? "—" : String(vendors.count ?? 0), note: "Awaiting review", icon: "◉" },
    { label: "Orders in progress", value: orders.error ? "—" : String(orders.count ?? 0), note: "Marketplace operational queue", icon: "▣" },
  ];
  const anyMetricError = [departments, employees, vendors, orders].some((item) => item.error);

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#18412F]">
      <div className="min-h-screen">
        <header className="sticky top-[5px] z-20 flex min-h-[76px] items-center justify-between gap-4 border-b border-[#E3EAE6] bg-white/95 px-4 pl-[68px] backdrop-blur-xl sm:px-7 sm:pl-[76px] lg:pl-8">
          <div><p className="text-xs font-semibold text-[#6B7280]">Umeed Of Life / Central Management</p><h1 className="mt-1 text-base font-black sm:text-lg">{config.title}</h1></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold text-[#18412F]">{employee.full_name || user.email || "Management"}</p><p className="text-xs text-[#6B7280]">{employee.job_title || config.badge}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1EC] font-black text-[#18412F]">{String(employee.full_name || "U").trim().charAt(0).toUpperCase()}</span></div>
        </header>

        <main className="mx-auto max-w-[1232px] space-y-8 px-4 py-6 sm:px-7 sm:py-8 xl:px-0 xl:py-9">
          <section className="relative overflow-hidden rounded-[32px] bg-[#18412F] p-6 text-white shadow-[0_1px_2px_rgba(24,65,47,0.04)] sm:p-12">
            <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[30px] border-white/[0.06]" />
            <div className="pointer-events-none absolute -right-3 -top-9 h-44 w-44 rounded-full border border-white/10" />
            <div className="relative max-w-3xl"><p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#D9A55B]">{config.badge}</p><h2 className="mt-5 text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl">Welcome, {employee.full_name || kind.replaceAll("_", " ")}</h2><p className="mt-3 text-base text-[#D8E4DD]">{config.welcome}. Manage the organization from one authorized workspace.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/management/departments" className="rounded-full bg-[#D9A55B] px-5 py-3 text-sm font-extrabold text-[#123526] transition hover:-translate-y-0.5 hover:bg-[#e5b66e]">Manage departments <span className="ml-2">→</span></Link><Link href="/management/employees" className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15">View employees</Link></div></div>
          </section>

          <section>
            <div className="mb-4"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#B8741A]">At a glance</p><h2 className="mt-2 text-xl font-black sm:text-2xl">Organization snapshot</h2><p className="mt-1 text-sm text-[#6B7280]">Live Supabase counts where the connected schema and access policies allow them.</p></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="group rounded-[28px] border border-[#E3EAE6] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#C5D6CC] hover:shadow-[0_8px_24px_rgba(24,65,47,0.10)] sm:p-6"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#6B7280]">{metric.label}</p><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAF7] text-lg text-[#18412F]">{metric.icon}</span></div><p className="mt-4 text-3xl font-black tracking-tight text-[#18412F]">{metric.value}</p><p className="mt-2 text-xs leading-5 text-[#6B7280]">{metric.note}</p></article>)}</div>
            {anyMetricError && <p role="status" className="mt-4 rounded-2xl border border-[#E9D6B5] bg-[#FFF9EE] p-4 text-sm leading-6 text-[#805A25]">Some metrics could not be loaded. Check the related tables, columns, and Supabase policies. No sample numbers are shown.</p>}
          </section>

          <section>
            <div className="mb-4"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#B8741A]">Workspaces</p><h2 className="mt-2 text-xl font-black sm:text-2xl">Central operations</h2><p className="mt-1 text-sm text-[#6B7280]">Choose a workspace from the cards or the animated sidebar.</p></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{workspaces.map((item) => <Link key={item.title} href={item.href} className="group flex min-h-[190px] flex-col rounded-[28px] border border-[#E3EAE6] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C5D6CC] hover:shadow-[0_8px_24px_rgba(24,65,47,0.10)]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF1EC] text-xl text-[#18412F] transition duration-200 group-hover:scale-105 group-hover:bg-[#18412F] group-hover:text-white">{item.icon}</span><h3 className="mt-4 text-[19px] font-black text-[#18412F]">{item.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-[#6B7280]">{item.description}</p><div className="mt-4 flex items-center justify-between gap-2"><span className={`text-xs font-bold ${item.status === "Open workspace" ? "text-[#B8741A]" : "text-[#8A7460]"}`}>{item.status}</span><span className="text-sm font-bold text-[#18412F] transition-transform group-hover:translate-x-1">→</span></div></Link>)}</div>
          </section>
          <p className="text-xs leading-5 text-[#6B7280]">CEO and Co-CEO keep equivalent executive access. Sensitive actions must also be checked by server-side authorization and Supabase Row Level Security.</p>
        </main>
      </div>
    </div>
  );
}

function AccessMessage({ title, message }: { title: string; message: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#F8FAF7] px-5"><section className="max-w-lg rounded-[28px] border border-[#E3EAE6] bg-white p-8 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1EC] text-xl font-black text-[#18412F]">!</span><h1 className="mt-4 text-2xl font-black text-[#18412F]">{title}</h1><p className="mt-3 text-sm leading-7 text-[#6B7280]">{message}</p><Link href="/management/login" className="mt-6 inline-flex rounded-full bg-[#18412F] px-5 py-3 text-sm font-bold text-white hover:bg-[#123526]">Return to management login</Link></section></main>;
}
