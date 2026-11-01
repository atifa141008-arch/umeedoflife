"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Item = { id: string; product_name: string; quantity: number; line_total: number; product_image_url: string | null; variant_name: string | null };
type Order = { id: string; order_number: string | null; status: string; payment_method: string | null; payment_status: string | null; placed_at: string | null; created_at: string; tracking_number: string | null; items: Item[] };
type Payload = { orders?: Order[]; store?: string; error?: string };
const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/marketplace/vendor/orders", { cache: "no-store" });
      const data: Payload = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load orders.");
      setOrders(data.orders || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Connection error."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => orders.filter((o) => {
    const match = `${o.order_number || ""} ${o.items.map((i) => i.product_name).join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return match && (filter === "all" || o.status.toLowerCase() === filter.toLowerCase());
  }), [orders, query, filter]);
  const statuses = [...new Set(orders.map((o) => o.status))];
  return <main className="space-y-7 text-[#432a24]">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc5547]">SELLER CENTER / ORDERS</p><h1 className="mt-2 text-3xl font-black">My Orders</h1><p className="mt-2 text-sm text-[#846c63]">Only items sold by your store are shown. Order totals below cover your items only.</p></div><button onClick={() => void load()} className="rounded-xl border border-[#e7cfc5] bg-white px-5 py-3 text-sm font-bold">↻ Refresh</button></div>
    <div className="grid gap-3 sm:grid-cols-3">{[{ label: "Orders containing your items", value: orders.length }, { label: "Units ordered", value: orders.reduce((n, o) => n + o.items.reduce((x, i) => x + i.quantity, 0), 0) }, { label: "Your item sales (before adjustments)", value: money(orders.reduce((n, o) => n + o.items.reduce((x, i) => x + Number(i.line_total || 0), 0), 0)) }].map((s) => <div key={s.label} className="rounded-2xl border border-[#efdcd3] bg-white p-5"><p className="text-xs font-semibold text-[#93796d]">{s.label}</p><p className="mt-3 text-2xl font-black">{s.value}</p></div>)}</div>
    <section className="rounded-3xl border border-[#ecd9d0] bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex flex-wrap gap-3"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order number or product" className="min-w-0 flex-1 rounded-xl border border-[#e7d4cc] px-4 py-3 text-sm"/><select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-[#e7d4cc] bg-white px-4 py-3 text-sm"><option value="all">All statuses</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <p className="py-14 text-center text-sm text-[#846c63]">Loading your orders...</p> : visible.length === 0 ? <div className="py-16 text-center"><p className="text-xl font-extrabold">No orders found</p><p className="mt-2 text-sm text-[#93796d]">Orders will appear here once customers buy your products.</p></div> : <div className="space-y-3">{visible.map((o) => <Link key={o.id} href={`/marketplace/vendor/orders/${o.id}`} className="block rounded-2xl border border-[#f0e0d8] p-5 transition hover:border-[#c86c5a] hover:bg-[#fff9f6]"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-extrabold">{o.order_number || o.id.slice(0, 8)}</p><p className="mt-1 text-xs text-[#98796e]">{new Date(o.placed_at || o.created_at).toLocaleDateString("en-PK")} · {o.items.length} item line(s)</p></div><span className="rounded-full bg-[#fff0e9] px-3 py-1 text-xs font-bold capitalize text-[#a44236]">{o.status}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm"><span className="text-[#735a50]">{o.items.map((i) => `${i.product_name} ×${i.quantity}`).join(", ")}</span><strong>{money(o.items.reduce((n, i) => n + Number(i.line_total || 0), 0))} →</strong></div></Link>)}</div>}
    </section><p className="text-xs text-[#91776c]">This is a secure, read-only order view. Packing, courier booking and payment release will be enabled only after the status workflow is configured.</p>
  </main>;
}
