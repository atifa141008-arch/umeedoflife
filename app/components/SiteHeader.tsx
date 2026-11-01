"use client";

import Image from "next/image";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Our Impact", href: "/impact" },
  { label: "Careers", href: "/careers" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5ebe7] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-10 lg:py-5">

        {/* Official Logo */}
        <a
          href="/"
          aria-label="Umeed of Life homepage"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/umeed-logo.png"
            alt="Umeed of Life — Official Logo"
            width={3600}
            height={2400}
            priority
            className="h-auto w-[57.5px] object-contain sm:w-[75px] lg:w-[87.5px]"
          />
        </a>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 xl:flex 2xl:gap-3"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative whitespace-nowrap rounded-lg px-3 py-3 text-[15px] font-bold tracking-[0.01em] text-[#40574c] transition-all duration-200 hover:bg-[#f2f6f2] hover:text-[#173f32] 2xl:px-4 2xl:text-base"
            >
              {item.label}
              <span className="absolute bottom-1 left-3 right-3 h-[2px] origin-center scale-x-0 rounded-full bg-[#c58a37] transition-transform duration-200 group-hover:scale-x-100 2xl:left-4 2xl:right-4" />
            </a>
          ))}
        </nav>

        {/* Management Login */}
        <a
          href="/management/login"
          className="hidden shrink-0 items-center justify-center rounded-full border border-[#173f32] bg-[#173f32] px-6 py-3.5 text-[14px] font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c58a37] hover:bg-[#235746] hover:shadow-md lg:inline-flex 2xl:px-7 2xl:text-[15px]"
        >
          Management Login
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#dfe7e2] text-2xl text-[#173f32] transition hover:border-[#c58a37] hover:bg-[#f1f5f2] xl:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Responsive Mobile / Tablet Menu */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[#e5ebe7] bg-white px-5 py-4 shadow-lg xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3.5 text-[15px] font-bold text-[#40574c] transition hover:bg-[#f1f5f2] hover:text-[#173f32]"
              >
                {item.label}
              </a>
            ))}

            <a
              href="/management/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl border border-[#173f32] bg-[#173f32] px-4 py-3.5 text-center text-[15px] font-bold text-white transition hover:bg-[#235746]"
            >
              Management Login
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}