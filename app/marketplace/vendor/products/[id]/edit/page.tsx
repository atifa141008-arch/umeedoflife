"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; price: number; stock_quantity: number; status: string; is_active: boolean; sku?: string | null; created_at?: string };
type ApiData = { store?: string; products?: Product[]; error?: string };
const money = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState("My Store");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/marketplace/vendor/products", { cache: "no-store" });
      const data: ApiData = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load your products.");
      setProducts(Array.isArray(data.products) ? data.products : []);
      setStore(data.store || "My Store");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Connection failed."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => products.filter((p) => {
    const search = `${p.name} ${p.sku || ""}`.toLowerCase().includes(query.trim().toLowerCase());
    const status = filter === "all" || (filter === "out-of-stock" ? p.stock_quantity <= 0 : p.status.toLowerCase() === filter);
    return search && status;
  }), [products, query, filter]);
  const drafts = products.filter((p) => p.status.toLowerCase() === "draft").length;
  const published = products.filter((p) => p.status.toLowerCase() === "published" && p.is_active).length;

  async function deleteDraft(product: Product) {
    if (deleting || product.status.toLowerCase() !== "draft") return;
    if (!window.confirm(`Permanently delete draft “${product.name}”? This cannot be undone.`)) return;
    setDeleting(product.id); setError("");
    try {
      const response = await fetch(`/api/marketplace/vendor/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete product.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Delete failed."); }
    finally { setDeleting(null); }
  }

  return (
    <main className="text-[#432a24]">
      <div className="space-y-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bf5647]">Umeed Marketplace · {store}</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Product Management</h1>
            <p className="mt-2 text-sm text-[#866d64]">Manage your own catalogue, stock and drafts. Only approved products appear to customers.</p>
          </div>
          <Link href="/marketplace/vendor/products/new" className="rounded-xl bg-[#b6473b] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#96382e]">+ Add New Product</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[{ label: "Total products", value: products.length }, { label: "Drafts", value: drafts }, { label: "Live products", value: published }].map((item) =>
            <div key={item.label} className="rounded-2xl border border-[#efd9d0] bg-white p-5"><p className="text-sm text-[#856c62]">{item.label}</p><p className="mt-2 text-3xl font-black">{item.value}</p></div>
          )}
        </div>
        <section className="rounded-3xl border border-[#efd9d0] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap gap-3">
            <input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by product name or SKU" className="min-w-0 flex-1 rounded-xl border border-[#e9d4ca] px-4 py-3 text-sm outline-none focus:border-[#b6473b]" />
            <select aria-label="Filter products" value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-[#e9d4ca] bg-white px-4 py-3 text-sm"><option value="all">All products</option><option value="draft">Drafts</option><option value="published">Published</option><option value="pending">Pending</option><option value="out-of-stock">Out of stock</option></select>
            <button type="button" onClick={() => void load()} className="rounded-xl border border-[#e9d4ca] px-4 py-3 text-sm font-bold hover:bg-[#fff7f3]">Refresh</button>
          </div>
          {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {loading ? <p className="py-12 text-center text-sm text-[#856c62]">Loading products...</p> : filtered.length === 0 ?
            <div className="py-14 text-center"><p className="text-lg font-bold">No matching products</p><p className="mt-2 text-sm text-[#856c62]">Try a different search, or add a new product.</p></div> :
            <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-[#efddd5] text-xs uppercase tracking-wide text-[#80685f]"><th className="pb-4 pr-4">Product</th><th className="pb-4 pr-4">Price</th><th className="pb-4 pr-4">Stock</th><th className="pb-4 pr-4">Status</th><th className="pb-4 text-right">Actions</th></tr></thead><tbody>
              {filtered.map((product) => <tr key={product.id} className="border-b border-[#f5e9e3] last:border-0"><td className="py-5 pr-4"><p className="max-w-[320px] font-bold">{product.name}</p>{product.sku && <p className="mt-1 text-xs text-[#8e766c]">SKU: {product.sku}</p>}</td><td className="py-5 pr-4 font-semibold">{money(product.price)}</td><td className="py-5 pr-4"><span className={product.stock_quantity === 0 ? "font-bold text-red-700" : ""}>{product.stock_quantity}</span></td><td className="py-5 pr-4"><span className="rounded-full bg-[#fff0e7] px-3 py-1 text-xs font-bold capitalize text-[#a74a3d]">{product.status}</span></td><td className="py-5 text-right"><div className="flex justify-end gap-2">{product.status.toLowerCase() === "draft" ? <><Link href={`/marketplace/vendor/products/${product.id}/edit`} className="rounded-lg border border-[#d9ada1] px-3 py-2 font-bold text-[#a64237] hover:bg-[#fff6f2]">Edit</Link><button type="button" disabled={deleting !== null} onClick={() => void deleteDraft(product)} className="rounded-lg border border-red-200 px-3 py-2 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">{deleting === product.id ? "Deleting..." : "Delete"}</button></> : <span className="text-xs text-[#856c62]">Editing unavailable</span>}</div></td></tr>)}
            </tbody></table></div>}
        </section>
        <p className="text-xs leading-6 text-[#846c63]">Only draft products can be edited or deleted with the current secure API. Product approval and publishing will be connected to management separately.</p>
      </div>
    </main>
  );
}
