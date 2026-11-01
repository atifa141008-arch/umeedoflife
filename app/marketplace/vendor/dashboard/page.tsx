"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; price: number; stock_quantity: number; status: string; is_active: boolean; sku?: string | null };
type Data = { store?: string; products?: Product[]; error?: string };

export default function VendorDashboardPage() {
  const [store, setStore] = useState("Your Store");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/marketplace/vendor/products", { cache: "no-store" });
      const data: Data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load your store.");
      setStore(data.store || "Your Store");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (e) { setError(e instanceof Error ? e.message : "Connection failed."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const metrics = useMemo(() => [
    { title: "Total Products", value: products.length, note: "Your catalogue", icon: "▤", shade: "bg-[#fff0e9] text-[#bd5944]" },
    { title: "Live Products", value: products.filter((p) => p.is_active && p.status.toLowerCase() === "published").length, note: "Active on marketplace", icon: "◉", shade: "bg-[#ecf6ef] text-[#348e60]" },
    { title: "Draft Products", value: products.filter((p) => p.status.toLowerCase() === "draft").length, note: "Not visible publicly", icon: "✎", shade: "bg-[#fff5e8] text-[#ba8040]" },
    { title: "Out of Stock", value: products.filter((p) => p.stock_quantity <= 0).length, note: "May need restocking", icon: "!", shade: "bg-[#faeeee] text-[#b94e4e]" },
  ], [products]);
  const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;
  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#c14e3c]">Store Overview</p><h2 className="mt-3 text-2xl font-black tracking-tight text-[#3b2823] sm:text-[32px]">Welcome back, {store}</h2><p className="mt-2 text-sm text-[#99786c]">Your store at a glance. All product figures come from your own account.</p></div><button type="button" onClick={() => void refresh()} disabled={loading} className="rounded-xl border border-[#ecdcd3] bg-white px-4 py-3 text-sm font-semibold text-[#916154] shadow-sm disabled:opacity-50">↻ Refresh data</button></div>
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error} <Link href="/marketplace/vendor/login" className="underline">Seller login</Link></div>}
    <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#8f322f] to-[#ca604a] px-6 py-9 text-white sm:px-9 sm:py-11"><div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[34px] border-white/5" /><div className="relative max-w-2xl"><span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em]">Your business, one place</span><h3 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">Build your store with confidence.</h3><p className="mt-4 text-sm leading-7 text-white/90">Add products with full details and images, keep your catalogue organized, and manage your store profile.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/marketplace/vendor/products/new" className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#9d372f] hover:bg-[#fff3eb]">+ Add new product</Link><Link href="/marketplace/vendor/products" className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20">Manage products →</Link></div></div></section>
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map((m) => <div key={m.title} className="rounded-2xl border border-[#efdfd7] bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-[#99766a] sm:text-sm">{m.title}</p><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-bold ${m.shade}`}>{m.icon}</span></div><p className="mt-4 text-3xl font-black text-[#452821]">{loading ? "—" : m.value}</p><p className="mt-1 text-[11px] text-[#a68a80]">{m.note}</p></div>)}</section>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]"><section className="rounded-3xl border border-[#efdfd7] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-black">Recent Products</h3><p className="mt-1 text-xs text-[#a08073]">Your latest catalogue entries</p></div><Link className="text-xs font-bold text-[#b44537] hover:underline" href="/marketplace/vendor/products">View all →</Link></div><div className="mt-5 divide-y divide-[#f3e9e4]">{!loading && products.length === 0 ? <div className="py-10 text-center"><p className="font-semibold">No products added yet</p><Link className="mt-2 inline-block text-sm font-bold text-[#b44537]" href="/marketplace/vendor/products/new">Add your first product →</Link></div> : products.slice(0, 5).map((p) => <div key={p.id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="truncate text-sm font-bold">{p.name}</p><p className="mt-1 text-xs text-[#a08073]">{money(p.price)} · {p.stock_quantity} in stock</p></div><div className="flex shrink-0 items-center gap-2"><span className="rounded-lg bg-[#fff0e8] px-2 py-1 text-[10px] font-bold capitalize text-[#a94b3b]">{p.status}</span>{p.status.toLowerCase() === "draft" && <Link className="rounded-lg border border-[#f0d8cd] px-3 py-2 text-xs font-bold text-[#ad463a]" href={`/marketplace/vendor/products/${p.id}/edit`}>Edit</Link>}</div></div>)}</div></section><section className="rounded-3xl border border-[#efdfd7] bg-white p-5 shadow-sm sm:p-6"><h3 className="text-lg font-black">Quick Actions</h3><p className="mt-1 text-xs text-[#a08073]">Everything you need to get started</p><div className="mt-5 space-y-3">{[{ href: "/marketplace/vendor/products/new", icon: "+", title: "Add a product", detail: "Details, prices and photos" }, { href: "/marketplace/vendor/products", icon: "▤", title: "Manage products", detail: "Edit drafts, stock and listings" }, { href: "/marketplace/vendor/profile", icon: "♧", title: "Store & payout profile", detail: "Pickup address and bank status" }].map((a) => <Link key={a.href} href={a.href} className="flex items-center gap-3 rounded-2xl border border-[#f0e3dc] p-3 hover:border-[#dcae9d] hover:bg-[#fff8f4]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0e8] text-xl font-bold text-[#ac493d]">{a.icon}</span><span className="flex-1"><span className="block text-sm font-bold">{a.title}</span><span className="mt-1 block text-xs text-[#a08073]">{a.detail}</span></span><span className="text-[#b54a3a]">→</span></Link>)}</div><div className="mt-6 rounded-xl bg-[#fff7f0] p-4 text-xs leading-6 text-[#987466]">Orders, courier tracking and earnings will appear after their secure backend workflows are connected.</div></section></div>
  </div>;
}
