
"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function VendorHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/marketplace/vendor"
          className="flex shrink-0 items-center gap-2"
          aria-label="Umeed Marketplace Vendor Home"
        >
          <Image
  src="/images/umeed-marketplace-logo.png"
  alt="Umeed Marketplace Logo"
  width={180}
  height={55}
  priority
  className="h-11 w-auto object-contain"
/>

          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-gray-900 sm:text-lg">
              Umeed
              <span className="text-orange-600"> Marketplace</span>
            </span>
            <span className="block text-xs font-medium text-gray-500">
              Seller Center
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Vendor navigation"
        >
          <Link
            href="/marketplace/vendor"
            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
          >
            Home
          </Link>

          <a
            href="/marketplace/vendor#how-it-works"
            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
          >
            How It Works
          </a>

          <a
            href="/marketplace/vendor#why-umeed"
            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
          >
            Why Umeed?
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/marketplace/vendor/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            Sign In
          </Link>

          <Link
            href="/marketplace/vendors/registration"
            className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Become a Vendor
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-100 text-gray-700 transition hover:bg-orange-50 sm:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-2xl leading-none">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-orange-100 bg-white px-4 py-4 sm:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1"
            aria-label="Mobile vendor navigation"
          >
            <Link
              href="/marketplace/vendor"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50"
            >
              Home
            </Link>

            <a
              href="/marketplace/vendor#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50"
            >
              How It Works
            </a>

            <a
              href="/marketplace/vendor#why-umeed"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50"
            >
              Why Umeed?
            </a>

            <div className="mt-2 grid grid-cols-1 gap-2 border-t border-orange-100 pt-3">
              <Link
                href="/marketplace/vendor/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-orange-200 px-4 py-3 text-center text-sm font-semibold text-gray-800 hover:bg-orange-50"
              >
                Vendor Sign In
              </Link>

              <Link
                href="/marketplace/vendors/registration"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-orange-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-orange-700"
              >
                Become a Vendor
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

