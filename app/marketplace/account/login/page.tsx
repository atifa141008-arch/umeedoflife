"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MarketplaceHeader from "../../components/MarketplaceHeader";

export default function LoginPage() {
  const [isApplicationCheck, setIsApplicationCheck] = useState(false);
  useEffect(() => {
    setIsApplicationCheck(new URLSearchParams(window.location.search).get("purpose") === "application");
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <main className="mp-shell min-h-screen">
      <MarketplaceHeader />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1fr_.9fr] lg:gap-16">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d6ca] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#bd5945]">
            <span className="h-2 w-2 rounded-full bg-[#df604b]" /> Secure account access
          </div>
          <h1 className="mt-6 max-w-xl text-5xl font-black leading-[1.08] tracking-tight text-[#302b29]">Welcome back<span className="text-[#df604b]">.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-[#82736c]">Sign in to continue to your Umeed Marketplace account. Your account area keeps your shopping activity and updates together.</p>
          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#f0e3dc] bg-white p-4"><span className="text-xl">⌁</span><p className="mt-3 text-sm font-extrabold">One account</p><p className="mt-1 text-xs leading-5 text-[#82736c]">A simple place for your marketplace activity.</p></div>
            <div className="rounded-2xl border border-[#f0e3dc] bg-white p-4"><span className="text-xl">✓</span><p className="mt-3 text-sm font-extrabold">Account protection</p><p className="mt-1 text-xs leading-5 text-[#82736c]">Keep your password private and unique.</p></div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[28px] border border-[#f0e3dc] bg-white p-6 shadow-[0_24px_70px_rgba(112,70,48,.09)] sm:p-9">
          <div className="mb-7 lg:hidden"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#c76a53]">UMEED MARKETPLACE</p><h1 className="mt-2 text-3xl font-black tracking-tight">Welcome back.</h1></div>
          <div className="mb-7"><p className="text-sm font-bold text-[#bd5945]">{isApplicationCheck ? "Seller application" : "Your account"}</p><h2 className="mt-2 text-2xl font-black tracking-tight">{isApplicationCheck ? "Check your application" : "Sign in"}</h2><p className="mt-2 text-sm leading-6 text-[#82736c]">{isApplicationCheck ? "Sign in to continue to your seller application status." : "Enter your email and password to continue."}</p></div>
          <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setMessage("Sign-in is a UI preview only. Secure account authentication is not connected in this frontend package, so no credentials were sent or saved."); }}>
            <label className="block"><span className="mp-label">Email address</span><input className="mp-input" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
            <label className="block"><span className="mp-label">Password</span><div className="relative"><input className="mp-input pr-20" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-[#bd5945]">{showPassword ? "Hide" : "Show"}</button></div></label>
            <div className="flex items-center justify-between gap-3 text-xs text-[#82736c]"><span>Use your registered email address.</span><span className="font-semibold">Private &amp; secure</span></div>
            {message ? <p role="status" className="rounded-xl border border-[#f0d6ca] bg-[#fff7f2] p-3 text-sm leading-6 text-[#9b4c3a]">{message}</p> : null}
            <button className="mp-primary w-full" type="submit">Sign in <span aria-hidden>→</span></button>
          </form>
          <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-[#f0e3dc]"/><span className="text-xs text-[#a2938b]">NEW TO UMEED?</span><span className="h-px flex-1 bg-[#f0e3dc]"/></div>
          <Link href="/marketplace/account/register" className="mp-secondary w-full">Create an account</Link>
          <p className="mt-5 text-center text-xs leading-5 text-[#92847d]">Never share your password or verification codes with anyone.</p>
        </section>
      </div>
    </main>
  );
}
