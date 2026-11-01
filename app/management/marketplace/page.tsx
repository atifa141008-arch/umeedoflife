import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


function MetricCard({ label, value, note, href }: { label: string; value: string; note: string; href: string }) {
  return <Link href={href} className="group rounded-2xl border border-[#f2dfd7] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#e9b9a8] hover:shadow-lg hover:shadow-[#c54c36]/5 sm:p-6"><p className="text-sm font-semibold text-[#98766c]">{label}</p><p className="mt-3 text-3xl font-black tracking-tight text-[#44251e]">{value}</p><p className="mt-2 text-xs leading-5 text-[#a9877d]">{note}</p><span className="mt-4 inline-flex text-xs font-bold text-[#c54c36]">Open section <span className="ml-1 transition group-hover:translate-x-1">→</span></span></Link>;
}

export default async function MarketplaceManagementDashboard() {
  const supabase = await createClient();
  const [vendors, products, orders, returns, payouts, cod] = await Promise.all([
    supabase.from("marketplace_vendors").select("id", { count: "exact", head: true }).eq("application_status", "pending"),
    supabase.from("marketplace_products").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("marketplace_orders").select("id", { count: "exact", head: true }).in("status", ["placed", "confirmed", "packed", "shipped", "out_for_delivery"]),
    supabase.from("marketplace_returns").select("id", { count: "exact", head: true }).in("status", ["requested", "under_review"]),
    supabase.from("marketplace_payout_requests").select("id", { count: "exact", head: true }).in("status", ["requested", "approved"]),
    supabase.from("marketplace_cod_remittances").select("id", { count: "exact", head: true }).in("status", ["pending", "mismatch"]),
  ]);
  const stats = [vendors, products, orders, returns, payouts, cod];
  const labels = ["Pending vendor applications", "Products awaiting review", "Orders in progress", "Returns to review", "Payout requests", "COD items to reconcile"];
  const values = stats.map(result => result.error ? "—" : String(result.count ?? 0));
  const hasSchemaError = stats.some(result => result.error);

  return <div className="space-y-8">
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff0e8] via-[#ffe5d8] to-[#ffd6c7] p-6 sm:p-9 lg:p-10">
      <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/30" /><div className="absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-white/20" />
      <div className="relative max-w-3xl"><span className="inline-flex rounded-full border border-[#e9b6a5] bg-white/65 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#b94732]">Management overview</span><h1 className="mt-5 text-3xl font-black tracking-tight text-[#44251e] sm:text-4xl">Marketplace operations,<br className="hidden sm:block" /> all in one place.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#805b51] sm:text-base">Review the work that needs attention, manage marketplace operations, and keep vendor and buyer workflows moving.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/management/marketplace/vendors" className="rounded-xl bg-[#c54c36] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#a93d2a]">Review vendors <span className="ml-2">→</span></Link><Link href="/management/marketplace/orders" className="rounded-xl border border-[#e6b9aa] bg-white/75 px-5 py-3 text-sm font-bold text-[#71483e] transition hover:bg-white">View orders</Link></div></div>
    </section>
    <section><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-black text-[#44251e] sm:text-xl">Needs attention</h2><p className="mt-1 text-sm text-[#98766c]">Counts are queried from Supabase; no sample figures are inserted.</p></div><span className="rounded-full border border-[#f0ddd5] bg-white px-3 py-1.5 text-xs font-semibold text-[#98766c]">Live database summary</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{labels.map((label, index) => <MetricCard key={label} label={label} value={values[index]} note={stats[index].error ? "Could not load this count. Check the Supabase schema and access policies." : "Current records matching this workflow"} href={["/management/marketplace/vendors", "/management/marketplace/products/review", "/management/marketplace/orders", "/management/marketplace/returns", "/management/marketplace/payouts", "/management/marketplace/cod"][index]} />)}</div>
      {hasSchemaError && <p role="status" className="mt-4 rounded-xl border border-[#f1d3a5] bg-[#fff9e9] p-4 text-sm leading-6 text-[#805b36]">Some counts could not be loaded. This can happen if the Marketplace schema has not been applied in Supabase yet or its Row Level Security policies do not allow this query. The dashboard does not replace missing data with invented values.</p>}
    </section>
    <section><div className="mb-4"><h2 className="text-lg font-black text-[#44251e] sm:text-xl">Quick access</h2><p className="mt-1 text-sm text-[#98766c]">Jump directly to an operations area.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ title: "COD reconciliation", description: "Compare expected and received courier cash.", href: "/management/marketplace/cod", icon: "⇄" }, { title: "Vendor payouts", description: "Review eligible requests before releasing funds.", href: "/management/marketplace/payouts", icon: "↗" }, { title: "Product review", description: "Review products submitted by marketplace sellers.", href: "/management/marketplace/products/review", icon: "◇" }, { title: "Reports", description: "Open marketplace operational reports.", href: "/management/marketplace/reports", icon: "▥" }].map(item => <Link key={item.title} href={item.href} className="flex gap-4 rounded-2xl border border-[#f2dfd7] bg-white p-5 transition hover:border-[#e9b9a8] hover:shadow-md"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-xl text-[#c54c36]">{item.icon}</span><span><span className="block text-sm font-extrabold text-[#56372f]">{item.title}</span><span className="mt-1 block text-xs leading-5 text-[#98766c]">{item.description}</span></span></Link>)}</div></section>
  </div>;
}
