"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { id: string; product_name: string; product_sku: string | null; variant_name: string | null; quantity: number; unit_price: number; line_total: number; product_image_url: string | null };
type Order = { id: string; order_number: string | null; status: string; payment_method: string | null; payment_status: string | null; placed_at: string | null; created_at: string; tracking_number: string | null; items: Item[] };
const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;
export default function SellerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => { try {
      const response = await fetch("/api/marketplace/vendor/orders", { cache: "no-store" });
      const data: { orders?: Order[]; error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load order.");
      const found = (data.orders || []).find((o) => o.id === id);
      if (!found) throw new Error("Order not found in your seller account.");
      if (alive) setOrder(found);
    } catch (e) { if (alive) setError(e instanceof Error ? e.message : "Unable to load order."); }
    finally { if (alive) setLoading(false); } })();
    return () => { alive = false; };
  }, [id]);
  return <main className="space-y-6 text-[#432a24]"><Link href="/marketplace/vendor/orders" className="text-sm font-bold text-[#ae493a]">← All orders</Link><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#b64d40]">SELLER CENTER / ORDER DETAILS</p><h1 className="mt-2 text-3xl font-black">{order ? `Order ${order.order_number || order.id.slice(0, 8)}` : "Order Details"}</h1></div>
    {loading && <p className="rounded-2xl bg-white p-6">Loading order...</p>}{error && <p role="alert" className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</p>}
    {order && <><div className="grid gap-3 sm:grid-cols-3">{[{ label: "Order status", value: order.status }, { label: "Payment", value: `${order.payment_method || "—"} · ${order.payment_status || "—"}` }, { label: "Tracking number", value: order.tracking_number || "Not assigned" }].map((item) => <div key={item.label} className="rounded-2xl border border-[#ecd8ce] bg-white p-5"><p className="text-xs text-[#94766a]">{item.label}</p><p className="mt-2 break-words text-base font-extrabold capitalize">{item.value}</p></div>)}</div><section className="rounded-3xl border border-[#ecd8ce] bg-white p-6"><h2 className="text-xl font-black">Your products in this order</h2><div className="mt-5 divide-y divide-[#f0e1da]">{order.items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-bold">{item.product_name}</p><p className="mt-1 text-xs text-[#96786c]">{item.product_sku ? `SKU ${item.product_sku} · ` : ""}{item.variant_name ? `${item.variant_name} · ` : ""}Qty {item.quantity} × {money(item.unit_price)}</p></div><strong>{money(item.line_total)}</strong></div>)}</div><div className="mt-4 flex justify-between border-t border-[#eddcd5] pt-4"><span className="font-bold">Your items subtotal</span><strong>{money(order.items.reduce((n, i) => n + Number(i.line_total || 0), 0))}</strong></div></section><p className="rounded-2xl border border-[#f0d9ca] bg-[#fff6f1] p-5 text-sm text-[#7e564a]">Packing and courier handover actions are not enabled yet. This prevents incorrect status changes until the seller-level fulfillment workflow is configured.</p></>}
  </main>;
}
