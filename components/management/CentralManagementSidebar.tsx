"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type LeaderKind = "CEO" | "CO_CEO" | "MANAGEMENT_HEAD";

const navigation = [
  { label: "Dashboard", href: "dashboard", icon: "▦", group: "OVERVIEW" },
  { label: "Departments", href: "/management/departments", icon: "▤", group: "ORGANIZATION" },
  { label: "Employees", href: "/management/employees", icon: "♙", group: "ORGANIZATION" },
  { label: "Roles & Permissions", href: "/management/roles", icon: "◇", group: "ORGANIZATION" },
  { label: "Investors", href: "/management/workspace/investors", icon: "◉", group: "GOVERNANCE" },
  { label: "News & Updates", href: "/management/workspace/news", icon: "▧", group: "GOVERNANCE" },
  { label: "Audit Logs", href: "/management/workspace/audit-logs", icon: "≡", group: "GOVERNANCE" },
];

const homePath: Record<LeaderKind, string> = {
  CEO: "/management/ceo",
  CO_CEO: "/management/co-ceo",
  MANAGEMENT_HEAD: "/management/head",
};

export default function CentralManagementSidebar({ kind }: { kind: LeaderKind }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const home = homePath[kind];
  const groups = ["OVERVIEW", "ORGANIZATION", "GOVERNANCE"];

  return (
    <>
      <div className="sticky top-0 z-40 flex h-[5px] w-full bg-[#2D3748]" aria-hidden="true" />
      <div className="fixed left-4 top-5 z-[60] lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E3EAE6] bg-white text-xl text-[#18412F] shadow-sm transition hover:-translate-y-0.5"
        >
          {mobileOpen ? "×" : "☰"}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-[#123526]/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#E3EAE6] bg-white transition-transform duration-300 ease-out lg:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <Link href={home} onClick={() => setMobileOpen(false)} className="flex min-h-[92px] items-center gap-3 border-b border-[#E3EAE6] px-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#18412F] text-2xl font-black text-white shadow-sm">U</span>
          <span className="min-w-0"><span className="block text-[15px] font-black tracking-tight text-[#18412F]">Umeed Of Life</span><span className="mt-1 block text-xs text-[#6B7280]">Central Management</span></span>
          <span className="ml-auto hidden rounded-full bg-[#F8FAF7] px-2 py-1 text-[9px] font-bold tracking-wider text-[#B8741A] lg:inline-flex">HQ</span>
        </Link>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Central management navigation">
          {groups.map((group) => {
            const items = navigation.filter((item) => item.group === group);
            return (
              <div key={group}>
                <p className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.16em] text-[#9AA69F]">{group}</p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const href = item.href === "dashboard" ? home : item.href;
                    const active = item.href === "dashboard" ? pathname === home : pathname === href || (href !== "/management/departments" && href !== "/management/employees" && href !== "/management/roles" && pathname.startsWith(href));
                    return (
                      <Link
                        key={item.label}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${active ? "bg-[#EAF1EC] text-[#18412F]" : "text-[#626F67] hover:translate-x-0.5 hover:bg-[#F8FAF7] hover:text-[#18412F]"}`}
                      >
                        {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#B8741A]" />}
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition-colors ${active ? "bg-white text-[#18412F]" : "bg-[#F8FAF7] text-[#738078] group-hover:bg-white group-hover:text-[#18412F]"}`}>{item.icon}</span>
                        <span className="min-w-0 flex-1">{item.label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#B8741A]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-[#E3EAE6] p-4">
          <div className="mb-3 rounded-2xl bg-[#F8FAF7] p-3">
            <p className="text-xs font-extrabold text-[#18412F]">Authorized workspace</p>
            <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">Access is based on your assigned central role.</p>
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E3EAE6] px-4 py-3 text-sm font-bold text-[#18412F] transition hover:border-[#18412F] hover:bg-[#F8FAF7]">↪ <span>Sign out</span></button>
          </form>
        </div>
      </aside>
    </>
  );
}
