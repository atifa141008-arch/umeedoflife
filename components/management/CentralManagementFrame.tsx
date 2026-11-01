"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense, useState } from "react";

const items = [
  { label: "Dashboard", href: "/management", icon: "⌂" },
  { label: "CEO Dashboard", href: "/management/ceo", icon: "◆" },
  { label: "Co-CEO Dashboard", href: "/management/co-ceo", icon: "◇" },
  { label: "Management Head", href: "/management/head", icon: "▦" },
  { label: "Departments", href: "/management/departments", icon: "▤" },
  { label: "Employees & Teams", href: "/management/employees", icon: "♙" },
  { label: "Roles & Permissions", href: "/management/roles", icon: "◈" },
  { label: "Investors & Finance", href: "/management/workspace/investors", icon: "◉" },
  { label: "News & Updates", href: "/management/workspace/news", icon: "▧" },
  { label: "Audit Logs", href: "/management/workspace/audit-logs", icon: "≡" },
  { label: "Marketplace", href: "/management/marketplace", icon: "▣" },
];

export default function CentralManagementFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
  fallback={
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF7]">
      <div className="text-sm font-semibold text-[#18412F]">
        Loading Umeed Management...
      </div>
    </div>
  }
>
  <CentralManagementFrameContent>
    {children}
  </CentralManagementFrameContent>
</Suspense>
  );
}

function CentralManagementFrameContent({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (
    pathname === "/management/login" ||
    pathname.startsWith("/management/reset-password") ||
    pathname.startsWith("/management/forgot-password")
  ) {
    return <>{children}</>;
  }

  const active = (href: string) =>
    pathname === href ||
    (href !== "/management" && pathname.startsWith(href + "/"));

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#18412F]">
      <div className="fixed inset-x-0 top-0 z-[60] h-[5px] bg-[#2D3748]" />

      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-4 top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-xl border border-[#E3EAE6] bg-white text-xl text-[#18412F] shadow-sm transition hover:bg-[#EAF1EC] lg:hidden"
      >
        {mobileOpen ? "×" : "☰"}
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#123526]/35 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-[5px] z-50 flex w-[278px] flex-col border-r border-[#E3EAE6] bg-white transition-transform duration-300 ease-out ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Link
          href="/management"
          onClick={() => setMobileOpen(false)}
          className="flex min-h-[88px] items-center gap-3 border-b border-[#E3EAE6] px-5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#18412F] text-lg font-black text-[#D9A55B]">
            U
          </span>

          <span className="min-w-0">
            <span className="block text-[15px] font-black tracking-tight text-[#18412F]">
              Umeed Of Life
            </span>
            <span className="mt-1 block text-xs text-[#6B7280]">
              Central Management
            </span>
          </span>
        </Link>

        <nav
          aria-label="Central management navigation"
          className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        >
          <p className="px-3 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#9AA69F]">
            Workspace
          </p>

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                active(item.href)
                  ? "bg-[#EAF1EC] text-[#18412F]"
                  : "text-[#626F67] hover:translate-x-0.5 hover:bg-[#F8FAF7] hover:text-[#18412F]"
              }`}
            >
              {active(item.href) && (
                <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#B8741A]" />
              )}

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active(item.href)
                    ? "bg-white text-[#18412F]"
                    : "bg-[#F8FAF7] text-[#738078] group-hover:bg-white"
                }`}
              >
                {item.icon}
              </span>

              <span className="min-w-0 flex-1">{item.label}</span>

              {active(item.href) && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8741A]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#E3EAE6] p-4">
          <div className="mb-3 rounded-2xl bg-[#F8FAF7] p-3">
            <p className="text-xs font-extrabold text-[#18412F]">
              Authorized workspace
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#6B7280]">
              Access is checked by each protected page and API.
            </p>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E3EAE6] px-4 py-3 text-sm font-bold text-[#18412F] transition hover:border-[#18412F] hover:bg-[#F8FAF7]"
            >
              ↪ Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-h-screen pt-[5px] transition-[padding] duration-300 lg:pl-[278px]">
        <div className="min-h-[calc(100vh-5px)]">{children}</div>
      </div>
    </div>
  );
}