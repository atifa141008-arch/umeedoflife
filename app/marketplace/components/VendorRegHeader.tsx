"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



export default function VendorRegHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    window.location.href =
      "/marketplace?q=" + encodeURIComponent(query) +
      "#marketplace-products";
  }

  return (
    <header>
      {/* Main header */}
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-9">
        <Link
          href="/marketplace"
          className="market-logo group flex shrink-0 items-center gap-2.5"
          aria-label="Umeed Marketplace home"
        >
          <span className="relative flex h-auto w-25 items-center justify-center overflow-hidden rounded-2xl  transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
            <Image
              src="/images/umeed-marketplace-logo.png"
              alt="Umeed Marketplace logo"
              width={360}
              height={240}
              priority
              className="h-full w-full object-contain"
            />
          </span>

          
        </Link>

        {/* Search */}
        

        {/* Buyer actions */}
      </div>

      {/* Desktop navigation */}
      

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-[#f5e6df] bg-white transition-all duration-300 ease-out lg:hidden ${
          menuOpen
            ? "max-h-[600px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="space-y-2 px-5 py-4">
          <form onSubmit={submitSearch} className="flex gap-2 md:hidden">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              aria-label="Search Marketplace"
              className="min-w-0 flex-1 rounded-xl border border-[#eee0d9] bg-[#fffaf7] px-4 py-3 text-sm outline-none focus:border-[#e87961]"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#e87961] px-4 text-sm font-bold text-white"
            >
              Search
            </button>
          </form>

          

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/marketplace/account/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-[#f0d8cc] px-3 py-3 text-center text-sm font-bold text-[#b85f49]"
            >
              Buyer Login
            </Link>

            <Link
              href="/marketplace/account/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#fff0e8] px-3 py-3 text-center text-sm font-bold text-[#b85f49]"
            >
              Register
            </Link>
          </div>

          <Link
            href="/marketplace/vendor"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl bg-[#e87961] px-4 py-3 text-center text-sm font-bold text-white"
          >
            Become a Umeed Vendor →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .market-header {
          animation: headerEnter 550ms ease-out both;
        }

        .market-logo {
          animation: logoEnter 650ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .market-nav-link:hover .market-nav-underline {
          width: 100%;
        }

        .market-search {
          animation: searchEnter 700ms ease-out both;
        }

        @keyframes headerEnter {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoEnter {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes searchEnter {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .market-header,
          .market-logo,
          .market-search {
            animation: none;
          }

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  );
}