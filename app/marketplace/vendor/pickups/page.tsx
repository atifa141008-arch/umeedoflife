"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type Pickup = {
  id: string; order_id: string; status: string; ready_at: string | null; picked_up_at: string | null;
  vendor: { business_name: string; city: string } | null;
  order: { order_number: string; status: string; payment_status: string } | null;
  assignment: { courier_name: string; tracking_number: string; booking_reference: string | null; status: string } | null;
  items: { product_name: string; product_sku: string | null; quantity: number }[];
};
const formatDate = (value: string | null) => value ? new Date(value).toLocaleString("en-PK") : "—";
export default function ManagementPickupsPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");
  const [reference, setReference] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/management/marketplace/pickups", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load pickups.");
      setPickups(data.pickups || []);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load pickups."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => pickups.filter(p => {
    const term = `${p.order?.order_number || ""} ${p.vendor?.business_name || ""} ${p.assignment?.tracking_number || ""}`.toLowerCase();
    return term.includes(search.toLowerCase()) && (filter === "all" || (filter === "unassigned" && !p.assignment && p.status === "ready_for_pickup") || (filter === "assigned" && p.assignment?.status === "assigned") || (filter === "collected" && p.status === "picked_up"));
  }), [pickups, search, filter]);
  async function act(id: string, action: "assign" | "collect") {
    if (action === "collect" && !window.confirm("Confirm rider has physically collected this parcel?")) return;
    setBusy(id); setError("");
    try {
      const response = await fetch(`/api/management/marketplace/pickups/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, courier_name: courier, tracking_number: tracking, booking_reference: reference }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action failed.");
      setSelected(null); setCourier(""); setTracking(""); setReference("");
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Action failed."); }
    finally { setBusy(null); }
  }
  const input = "w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-500";
  return <main className="min-h-screen bg-[#fff8f4] px-4 py-8 text-slate-900 sm:px-8">
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-rose-600">Umeed Marketplace · Management</p><h1 className="mt-2 text-3xl font-extrabold">Pickup & Courier Control</h1><p className="mt-2 text-sm text-slate-500">Assign couriers to seller-ready parcels and confirm actual rider collection.</p></div><button onClick={() => void load()} className="rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-orange-50">Refresh queue</button></div>
      <div className="grid gap-4 sm:grid-cols-3">{[{ label: "Ready for Pickup", value: pickups.filter(p => p.status === "ready_for_pickup").length }, { label: "Courier Assigned", value: pickups.filter(p => p.assignment?.status === "assigned").length }, { label: "Collected", value: pickups.filter(p => p.status === "picked_up").length }].map(x => <div key={x.label} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">{x.label}</p><p className="mt-2 text-3xl font-bold text-rose-700">{x.value}</p></div>)}</div>
      <div className="flex flex-wrap gap-3 rounded-2xl border border-orange-100 bg-white p-4"><input className={`${input} min-w-52 flex-1`} placeholder="Search order, seller, tracking" value={search} onChange={e => setSearch(e.target.value)} /><select className={`${input} sm:w-56`} value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All pickups</option><option value="unassigned">Needs courier</option><option value="assigned">Courier assigned</option><option value="collected">Collected</option></select></div>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading pickup queue…</div> : filtered.length === 0 ? <div className="rounded-2xl border border-orange-100 bg-white p-12 text-center text-slate-500">No matching pickup records yet. Sellers must first mark orders Ready for Pickup.</div> : <div className="space-y-4">{filtered.map(p => <article key={p.id} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap justify-between gap-4"><div><div className="text-lg font-bold">{p.order?.order_number || p.order_id}</div><div className="mt-1 text-sm text-slate-500">{p.vendor?.business_name || "Seller"} · {p.vendor?.city || ""}</div><div className="mt-1 text-xs text-slate-400">Ready: {formatDate(p.ready_at)}</div></div><div className="text-right"><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">{p.status === "picked_up" ? "Collected" : p.assignment ? "Courier Assigned" : "Needs Courier"}</span><div className="mt-2 text-xs text-slate-500">Order: {p.order?.status || "—"}</div></div></div><div className="mt-4 border-t border-orange-100 pt-4 text-sm text-slate-600">{p.items.map((item, index) => <p key={index}>{item.product_name} · Qty {item.quantity}{item.product_sku ? ` · SKU ${item.product_sku}` : ""}</p>)}</div>{p.assignment && <div className="mt-4 rounded-xl bg-orange-50 p-4 text-sm"><b>{p.assignment.courier_name}</b> · Tracking: {p.assignment.tracking_number}{p.assignment.booking_reference && <p className="mt-1">Booking ref: {p.assignment.booking_reference}</p>}</div>}
        {p.status === "ready_for_pickup" && !p.assignment && <div className="mt-4">{selected !== p.id ? <button onClick={() => { setSelected(p.id); setCourier(""); setTracking(""); setReference(""); }} className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700">Assign courier</button> : <div className="space-y-3 rounded-xl border border-orange-200 p-4"><p className="text-sm font-bold">Record courier booking details</p><div className="grid gap-3 md:grid-cols-3"><input className={input} placeholder="Courier company" value={courier} maxLength={100} onChange={e => setCourier(e.target.value)}/><input className={input} placeholder="Tracking number" value={tracking} maxLength={120} onChange={e => setTracking(e.target.value)}/><input className={input} placeholder="Booking reference (optional)" value={reference} maxLength={120} onChange={e => setReference(e.target.value)}/></div><p className="text-xs text-slate-500">Book with the courier separately first. This form only records the booking.</p><div className="flex gap-2"><button disabled={busy === p.id} onClick={() => void act(p.id, "assign")} className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-50">Save assignment</button><button onClick={() => setSelected(null)} className="rounded-xl border px-5 py-2 text-sm">Cancel</button></div></div>}</div>}
        {p.status === "ready_for_pickup" && p.assignment?.status === "assigned" && <button disabled={busy === p.id} onClick={() => void act(p.id, "collect")} className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Confirm rider collection</button>}
      </article>)}</div>}
    </div>
  </main>;
}
