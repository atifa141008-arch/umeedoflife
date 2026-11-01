import Link from "next/link";
import type { ReactNode } from "react";
import MarketplaceHeader from "./MarketplaceHeader";

type Item = { title: string; description: string; href?: string; action?: string };
type NavItem = { label: string; href: string; active?: boolean };

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  items?: Item[];
  notice?: string;
  nav?: NavItem[];
  children?: ReactNode;
};

export default function MarketplaceWorkspace({
  eyebrow = "YOUR ACCOUNT",
  title,
  description,
  items = [],
  notice = "Your account data will appear here after the Supabase backend is connected.",
  nav = [],
  children,
}: Props) {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#c75b45]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black text-[#332923] sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[#82736c]">{description}</p>
        </div>

        {nav.length > 0 && (
          <nav aria-label="Workspace navigation" className="mb-6 flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  item.active
                    ? "border-[#df604b] bg-[#fff0e8] text-[#b84c3a]"
                    : "border-[#f0e2dc] bg-white text-[#75655d] hover:border-[#df604b]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {children ?? (
          <>
            <div className="rounded-2xl border border-[#f0e2dc] bg-white p-5 sm:p-7">
              <p className="text-sm leading-6 text-[#75655d]">{notice}</p>
            </div>
            {items.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-[#f0e2dc] bg-white p-5">
                    <h2 className="text-lg font-bold text-[#3b302a]">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#82736c]">{item.description}</p>
                    {item.href && (
                      <Link href={item.href} className="mt-4 inline-flex text-sm font-bold text-[#c75b45]">
                        {item.action ?? "Open"} →
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
