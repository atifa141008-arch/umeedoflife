"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const groups = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Overview", href: "/management/marketplace", icon: "▦" },
      { label: "Vendor applications", href: "/management/marketplace/vendors", icon: "♙" },
      { label: "Products", href: "/management/marketplace/products", icon: "◇" },
      { label: "Orders", href: "/management/marketplace/orders", icon: "▤" },
      { label: "Customers", href: "/management/marketplace/customers", icon: "♧" },
    ],
  },
  {
    title: "FULFILMENT & FINANCE",
    items: [
      { label: "COD reconciliation", href: "/management/marketplace/cod", icon: "⇄" },
      { label: "Payouts", href: "/management/marketplace/payouts", icon: "↗" },
      { label: "Returns", href: "/management/marketplace/returns", icon: "↩" },
      { label: "Shipments", href: "/management/marketplace/shipments", icon: "➤" },
      { label: "Couriers", href: "/management/marketplace/couriers", icon: "⌁" },
      { label: "Pickup requests", href: "/management/marketplace/pickups", icon: "⌖" },
    ],
  },
  {
    title: "STORE CONFIGURATION",
    items: [
      { label: "Categories", href: "/management/marketplace/categories", icon: "☷" },
      { label: "Vouchers & coupons", href: "/management/marketplace/coupons", icon: "%" },
      { label: "Banners", href: "/management/marketplace/banners", icon: "▧" },
      { label: "Disputes & messages", href: "/management/marketplace/disputes", icon: "◌" },
      { label: "Reports", href: "/management/marketplace/reports", icon: "▥" },
      { label: "Settings", href: "/management/marketplace/settings", icon: "⚙" },
    ],
  },
];

export default function MarketplaceManagementShell({ children, name }: { children: React.ReactNode; name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff9f6] text-[#44251e]">
      {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-[#351a14]/40 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#f3ded6] bg-white transition-all duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${collapsed ? "md:w-[84px]" : "md:w-[270px]"} w-[280px]`}>
        <div className="flex h-[78px] items-center justify-between border-b border-[#f7e8e2] px-5">
          <Link href="/management/marketplace" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e8] text-xl text-[#c54c36]">U</span>
            {!collapsed && <span className="min-w-0"><span className="block truncate text-sm font-black text-[#44251e]">Umeed Marketplace</span><span className="mt-0.5 block text-xs text-[#9a766d]">Management Center</span></span>}
          </Link>
          <button type="button" onClick={() => setCollapsed(v => !v)} className="hidden h-9 w-9 shrink-0 rounded-xl text-[#9a766d] hover:bg-[#fff4ef] md:block" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? "›" : "‹"}</button>
          <button type="button" onClick={() => setOpen(false)} className="h-9 w-9 rounded-xl text-[#9a766d] hover:bg-[#fff4ef] md:hidden" aria-label="Close sidebar">×</button>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Marketplace management navigation">
          {groups.map(group => <div key={group.title}>
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.16em] text-[#b69a91]">{group.title}</p>}
            <div className="space-y-1">{group.items.map(item => {
              const active = pathname === item.href || (item.href !== "/management/marketplace" && pathname.startsWith(item.href + "/"));
              return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} onClick={() => setOpen(false)} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-[#ffede5] text-[#bd442e]" : "text-[#795d55] hover:bg-[#fff6f2] hover:text-[#bd442e]"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-base ${active ? "bg-white" : "text-[#b18477]"}`}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d6533b]" />}
              </Link>;
            })}</div>
          </div>)}
        </nav>
        {!collapsed && <div className="m-3 rounded-2xl border border-[#f5dfd5] bg-[#fff8f4] p-4"><p className="text-xs font-bold text-[#704a40]">Secure workspace</p><p className="mt-1 text-xs leading-5 text-[#9a766d]">Access is limited to authorized management accounts.</p><form action="/auth/signout" method="post" className="mt-3"><button className="w-full rounded-xl border border-[#efd2c6] bg-white px-3 py-2 text-xs font-bold text-[#a94430] hover:bg-[#fff0e9]" type="submit">Sign out</button></form></div>}
      </aside>
      <div className={`min-h-screen transition-[padding] ${collapsed ? "md:pl-[84px]" : "md:pl-[270px]"}`}>
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#f3ded6] bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3"><button type="button" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f1ddd4] text-lg md:hidden" aria-label="Open navigation">☰</button><div><p className="text-xs font-semibold text-[#a9877d]">Umeed Marketplace / Management</p><p className="mt-0.5 text-sm font-extrabold text-[#44251e] sm:text-base">Operations workspace</p></div></div>
          <div className="flex items-center gap-3"><span className="hidden text-right sm:block"><span className="block text-sm font-bold text-[#5e4038]">{name}</span><span className="block text-xs text-[#a9877d]">Authorized management</span></span><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffede5] text-sm font-black text-[#bd442e]">{name.trim().charAt(0).toUpperCase() || "M"}</span></div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
