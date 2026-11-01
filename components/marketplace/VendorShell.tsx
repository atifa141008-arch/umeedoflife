"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type NavItem = { label: string; href: string; symbol: string; ready?: boolean; exact?: boolean };
const sections: { title: string; items: NavItem[] }[] = [
  { title: "Workspace", items: [
    { label: "Overview", href: "/marketplace/vendor/dashboard", symbol: "▦", ready: true },
    { label: "My Products", href: "/marketplace/vendor/products", symbol: "▤", ready: true, exact: true },
    { label: "Add New Product", href: "/marketplace/vendor/products/new", symbol: "+", ready: true },
    { label: "Orders", href: "/marketplace/vendor/orders", symbol: "▣", ready: true },
    { label: "Packing", href: "/marketplace/vendor/packing", symbol: "▥", ready: true },
    { label: "Pickup Tracking", href: "/marketplace/vendor/pickups", symbol: "↗", ready: true },
    { label: "Shipments", href: "/marketplace/vendor/shipments", symbol: "➚" },
  ]},
  { title: "Store & Business", items: [
    { label: "Store & Payout Profile", href: "/marketplace/vendor/profile", symbol: "♧", ready: true },
    { label: "Earnings", href: "/marketplace/vendor/earnings", symbol: "◈" },
    { label: "Analytics", href: "/marketplace/vendor/analytics", symbol: "▥" },
    { label: "Returns", href: "/marketplace/vendor/returns", symbol: "↩" },
    { label: "Support", href: "/marketplace/vendor/support", symbol: "?" },
  ]},
];

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [store, setStore] = useState("Seller account");
  const [signingOut, setSigningOut] = useState(false);
  const standalone = pathname === "/marketplace/vendor/login" || pathname === "/marketplace/vendor";

  useEffect(() => {
    if (standalone) return;
    let valid = true;
    void fetch("/api/marketplace/vendor/products", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data: { store?: string } | null) => { if (valid && data?.store) setStore(data.store); })
      .catch(() => {});
    return () => { valid = false; };
  }, [standalone]);

  if (standalone) return <>{children}</>;
  const activeLabel = pathname?.includes("/products/new") ? "Add New Product" : pathname?.includes("/products/") && pathname?.endsWith("/edit") ? "Edit Product" : sections.flatMap((s) => s.items).find((x) => x.exact ? pathname === x.href : pathname === x.href || (x.href !== "/marketplace/vendor/dashboard" && pathname?.startsWith(x.href + "/")))?.label || "Seller Center";

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try { await createClient().auth.signOut(); router.replace("/marketplace/vendor/login"); router.refresh(); }
    finally { setSigningOut(false); }
  }

  const navigation = <>
    <div className="flex h-[90px] flex-col justify-center border-b border-[#f0e1dc] px-6">
      <p className="text-[10px] font-black tracking-[0.25em] text-[#bf4c3a]">UMEED MARKETPLACE</p>
      <p className="mt-2 text-xl font-black tracking-tight text-[#4b2823]">Seller Center<span className="text-[#ca5140]">.</span></p>
    </div>
    <div className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
      {sections.map((section) => <div key={section.title}>
        <p className="mb-3 px-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b49488]">{section.title}</p>
        <nav className="space-y-1">{section.items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || (item.href !== "/marketplace/vendor/dashboard" && pathname?.startsWith(item.href + "/"));
          return item.ready ? <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition ${active ? "bg-[#fbe6df] text-[#ac392c]" : "text-[#67463d] hover:bg-[#fff5f1]"}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${active ? "bg-white" : "bg-[#faf7f5]"}`}>{item.symbol}</span><span className="flex-1">{item.label}</span>
          </Link> : <div key={item.href} title="This module is being developed" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-[#a9948c] opacity-75">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#faf7f5]">{item.symbol}</span><span className="flex-1">{item.label}</span><span className="rounded-md bg-[#f5eeeb] px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide">Soon</span>
          </div>;
        })}</nav>
      </div>)}
    </div>
    <div className="border-t border-[#f0e1dc] p-4"><div className="flex items-center gap-3 rounded-2xl bg-[#fff4ef] p-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#96332c] font-black text-white">{store.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#432822]">{store}</p><p className="text-xs text-[#9c766b]">Seller account</p></div></div></div>
  </>;

  return <div className="min-h-screen bg-[#faf7f5] text-[#432b25] lg:pl-[268px]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col border-r border-[#f0e1dc] bg-white lg:flex">{navigation}</aside>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} /><aside className="absolute inset-y-0 left-0 flex w-[268px] flex-col bg-white shadow-2xl">{navigation}</aside></div>}
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-[#eee1db] bg-white/95 px-4 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3"><button type="button" aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-xl border border-[#efded7] px-3 py-2 lg:hidden">☰</button><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-[#aa8b7e]">Seller Center / {activeLabel}</p><h1 className="truncate text-lg font-extrabold tracking-tight text-[#382620] sm:text-xl">{activeLabel}</h1></div></div>
      <div className="flex shrink-0 items-center gap-2"><Link href="/marketplace" className="hidden rounded-xl border border-[#eddcd5] px-4 py-2.5 text-xs font-bold text-[#795146] hover:bg-[#fff6f2] sm:inline-flex">View Marketplace ↗</Link><button disabled={signingOut} type="button" onClick={() => void signOut()} className="rounded-xl bg-[#8c302c] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#742620] disabled:opacity-60">{signingOut ? "Signing out..." : "Sign out"}</button></div>
    </header>
    <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-7 lg:px-8">{children}</div>
  </div>;
}
