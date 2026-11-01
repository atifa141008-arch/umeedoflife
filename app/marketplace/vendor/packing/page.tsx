"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Item = { id: string; product_name: string; product_sku: string | null; variant_name: string | null; quantity: number; line_total: number };
type Order = { id: string; order_number: string | null; status: string; payment_method: string; payment_status: string; created_at: string; tracking_number: string | null; items: Item[]; fulfillment: { status: string; packed_at?: string; ready_at?: string } };
const labels: Record<string, string> = { new: "To pack", packed: "Packed", ready_for_pickup: "Ready for pickup", picked_up: "Picked up", cancelled: "Cancelled" };
const money = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

export default function SellerPackingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [store, setStore] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/marketplace/vendor/packing", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load packing orders.");
      setOrders(data.orders || []); setStore(data.store || "");
    } catch (err) { setError(err instanceof Error ? err.message : "Connection error."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => orders.filter(o => (filter === "all" || o.fulfillment.status === filter) && `${o.order_number || o.id} ${o.items.map(i => i.product_name).join(" ")}`.toLowerCase().includes(query.toLowerCase())), [orders, filter, query]);
  async function update(orderId: string, action: "pack" | "ready") {
    setWorking(orderId); setError("");
    try {
      const response = await fetch("/api/marketplace/vendor/packing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, action }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update packing status.");
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Request failed."); }
    finally { setWorking(""); }
  }
  function slip(order: Order) {
    const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));
    const windowRef = window.open("", "_blank", "width=780,height=800");
    if (!windowRef) { setError("Please allow pop-ups to print the packing slip."); return; }
    const rows = order.items.map(i => `<tr><td>${escapeHtml(i.product_name)}${i.variant_name ? ` (${escapeHtml(i.variant_name)})` : ""}</td><td>${escapeHtml(i.product_sku || "—")}</td><td>${i.quantity}</td></tr>`).join("");
    windowRef.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Umeed Packing Slip</title><style>body{font:14px Arial;padding:32px;color:#392821}header{border-bottom:3px solid #a64235;padding-bottom:14px}h1{color:#a64235;margin:0}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border-bottom:1px solid #ddd;padding:12px;text-align:left}.note{margin-top:35px;border:1px dashed #bbb;padding:16px}@media print{button{display:none}}</style></head><body><header><h1>UMEED MARKETPLACE</h1><p>Seller Packing Slip · Not a courier shipping label</p></header><h2>Order ${escapeHtml(order.order_number || order.id.slice(0,8))}</h2><p>Seller: ${escapeHtml(store)}</p><p>Order placed: ${new Date(order.created_at).toLocaleDateString("en-PK")}</p><table><thead><tr><th>Product</th><th>SKU</th><th>Qty</th></tr></thead><tbody>${rows}</tbody></table><div class="note">Internal packing reference only. Courier label, customer delivery address and rider booking will be issued by authorized management.</div><p><button onclick="window.print()">Print slip</button></p></body></html>`);
    windowRef.document.close();
  }
  return <main className="space-y-7 text-[#432a24]">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#bc5547]">SELLER CENTER / FULFILLMENT</p><h1 className="mt-2 text-3xl font-black">Packing & Pickup</h1><p className="mt-2 text-sm text-[#846c63]">Pack your items, print a packing slip, then request management pickup.</p></div><button onClick={() => void load()} className="rounded-xl border border-[#e7cfc5] bg-white px-5 py-3 text-sm font-bold">↻ Refresh</button></div>
    <div className="grid gap-3 sm:grid-cols-3">{[{ label: "To pack", value: orders.filter(o => o.fulfillment.status === "new").length }, { label: "Packed", value: orders.filter(o => o.fulfillment.status === "packed").length }, { label: "Ready for pickup", value: orders.filter(o => o.fulfillment.status === "ready_for_pickup").length }].map(s => <div key={s.label} className="rounded-2xl border border-[#efdcd3] bg-white p-5"><p className="text-xs font-semibold text-[#93796d]">{s.label}</p><p className="mt-3 text-3xl font-black">{s.value}</p></div>)}</div>
    <section className="rounded-3xl border border-[#ecd9d0] bg-white p-5 shadow-sm sm:p-7"><div className="mb-5 flex flex-wrap gap-3"><input className="min-w-0 flex-1 rounded-xl border border-[#e7d4cc] px-4 py-3 text-sm" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search order or product"/><select className="rounded-xl border border-[#e7d4cc] bg-white px-4 py-3 text-sm" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All packing stages</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {loading ? <p className="py-12 text-center text-sm text-[#846c63]">Loading packing records...</p> : visible.length === 0 ? <div className="py-14 text-center"><h2 className="text-xl font-extrabold">No matching orders</h2><p className="mt-2 text-sm text-[#93796d]">Seller orders will appear here when available.</p></div> : <div className="space-y-4">{visible.map(o => { const canProcess = ["confirmed", "processing"].includes(o.status) && (o.payment_method === "cod" || o.payment_status === "paid"); return <article key={o.id} className="rounded-2xl border border-[#f0e0d8] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-black">{o.order_number || o.id.slice(0, 8)}</h2><p className="mt-1 text-xs text-[#98796e]">Order: {o.status} · Payment: {o.payment_status}</p></div><span className="rounded-full bg-[#fff0e9] px-3 py-2 text-xs font-bold text-[#a44236]">{labels[o.fulfillment.status] || o.fulfillment.status}</span></div><div className="my-4 space-y-2">{o.items.map(i => <div key={i.id} className="flex justify-between gap-4 border-b border-[#f6ece7] py-2 text-sm"><span>{i.product_name} {i.variant_name ? `(${i.variant_name})` : ""} × {i.quantity}</span><strong className="shrink-0">{money(i.line_total)}</strong></div>)}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => slip(o)} className="rounded-xl border border-[#e7cfc5] px-4 py-2.5 text-xs font-bold">Print Packing Slip</button>{o.fulfillment.status === "new" && <button type="button" disabled={!canProcess || !!working} onClick={() => void update(o.id, "pack")} className="rounded-xl bg-[#9b3c31] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{working === o.id ? "Saving..." : "Mark as Packed"}</button>}{o.fulfillment.status === "packed" && <button type="button" disabled={!canProcess || !!working} onClick={() => void update(o.id, "ready")} className="rounded-xl bg-[#9b3c31] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{working === o.id ? "Saving..." : "Ready for Pickup"}</button>}</div>{!canProcess && o.fulfillment.status === "new" && <p className="mt-3 text-xs text-amber-800">Packing becomes available after order confirmation and applicable payment verification.</p>}</article>; })}</div>}
    </section><p className="text-xs text-[#91776c]">Seller packing status is separate from customer order status. Courier booking and pickup confirmation are managed centrally.</p>
  </main>;
}
