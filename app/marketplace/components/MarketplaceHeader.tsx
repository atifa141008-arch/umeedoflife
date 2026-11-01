"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function MarketplaceHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        return;
      }

      setUser(null);
      setMobileMenuOpen(false);
      router.push("/marketplace");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    router.push(`/marketplace/shop?search=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  }

  const navigation = [
    { label: "Home", href: "/marketplace" },
    { label: "Categories", href: "/marketplace/categories" },
    { label: "Shop", href: "/marketplace/shop" },
    { label: "Vendors", href: "/marketplace/vendors" },
    { label: "About Us", href: "/marketplace/about" },
  ];

  function isActive(href: string) {
    if (href === "/marketplace") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f3e5df] bg-white">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-7">
        {/* DESKTOP HEADER: ALL ITEMS IN ONE ROW */}
        <div className="flex h-[76px] items-center gap-3 xl:gap-5">
          {/* LOGO: IMAGE ONLY, NO BACKGROUND, NO EXTRA TEXT */}
          <Link
            href="/marketplace"
            aria-label="Umeed Marketplace Home"
            className="relative flex h-[60px] w-[100px] shrink-0 items-center justify-center bg-transparent sm:w-[112px] xl:w-[120px]"
          >
            <Image
              src="/images/umeed-marketplace-logo.png"
              alt="Umeed Marketplace"
              width={240}
              height={120}
              priority
              className="h-auto max-h-[58px] w-25 object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex xl:gap-3 2xl:gap-5"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-2 py-2 text-[12px] font-semibold transition-colors xl:px-2.5 xl:text-[13px] 2xl:text-sm ${
                    active
                      ? "bg-[#fff0e8] text-[#d95743]"
                      : "text-[#3e3531] hover:bg-[#fff5f0] hover:text-[#d95743]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* SEARCH: SAME ROW */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden w-[145px] shrink-0 items-center rounded-full border border-[#eadbd4] bg-[#fffaf7] px-3 py-2 transition focus-within:border-[#e46c57] xl:flex 2xl:w-[190px]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="mr-2 h-4 w-4 shrink-0 text-[#9c8177]"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="min-w-0 w-full bg-transparent text-xs text-[#352d29] outline-none placeholder:text-[#a38d83]"
            />
          </form>

          {/* CART: SAME ROW */}
          <Link
            href="/marketplace/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-[#41332e] transition hover:bg-[#fff0e8] hover:text-[#d95743] xl:px-3"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-[21px] w-[21px]"
            >
              <path
                d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.2" fill="currentColor" />
              <circle cx="18" cy="20" r="1.2" fill="currentColor" />
            </svg>

            <span className="hidden text-xs font-semibold 2xl:inline">
              Cart
            </span>
          </Link>

          {/* AUTHENTICATION: SIGN IN/UP OR ACCOUNT/LOGOUT */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/marketplace/account"
                    className="max-w-[115px] truncate rounded-full border border-[#eadbd4] px-3 py-2 text-xs font-semibold text-[#44332e] transition hover:border-[#e46c57] hover:text-[#d95743] 2xl:max-w-[145px] 2xl:text-sm"
                    title={user.email ?? "My Account"}
                  >
                    Account
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="whitespace-nowrap rounded-full bg-[#df604b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#c94b38] disabled:cursor-not-allowed disabled:opacity-60 2xl:px-4 2xl:text-sm"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/marketplace/login"
                    className="whitespace-nowrap rounded-full border border-[#e46c57] px-3 py-2 text-xs font-semibold text-[#d95743] transition hover:bg-[#fff0e8] 2xl:px-4 2xl:text-sm"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/marketplace/register"
                    className="whitespace-nowrap rounded-full bg-[#df604b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#c94b38] 2xl:px-4 2xl:text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f0ded5] text-[#40312c] transition hover:bg-[#fff0e8] lg:hidden"
          >
            {mobileMenuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="border-t border-[#f3e5df] bg-white py-4 lg:hidden">
            {/* MOBILE SEARCH */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="mb-4 flex items-center rounded-xl border border-[#eadbd4] bg-[#fffaf7] px-3 py-3"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="mr-2 h-5 w-5 shrink-0 text-[#9c8177]"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#a38d83]"
              />

              <button
                type="submit"
                className="ml-2 shrink-0 text-sm font-semibold text-[#d95743]"
              >
                Search
              </button>
            </form>

            {/* MOBILE NAVIGATION */}
            <nav aria-label="Mobile navigation" className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(item.href)
                      ? "bg-[#fff0e8] text-[#d95743]"
                      : "text-[#40332e] hover:bg-[#fff6f1]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/marketplace/cart"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#40332e] hover:bg-[#fff6f1]"
              >
                Shopping Cart
              </Link>

              {!loading &&
                (user ? (
                  <div className="mt-3 space-y-2 border-t border-[#f3e5df] pt-3">
                    <Link
                      href="/marketplace/account"
                      className="block rounded-xl bg-[#fff0e8] px-4 py-3 text-sm font-semibold text-[#d95743]"
                    >
                      My Account
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full rounded-xl bg-[#df604b] px-4 py-3 text-left text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#f3e5df] pt-3">
                    <Link
                      href="/marketplace/login"
                      className="rounded-xl border border-[#e46c57] px-3 py-3 text-center text-sm font-semibold text-[#d95743]"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/marketplace/register"
                      className="rounded-xl bg-[#df604b] px-3 py-3 text-center text-sm font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}