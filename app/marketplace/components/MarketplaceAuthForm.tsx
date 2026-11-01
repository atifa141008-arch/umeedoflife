"use client";

import Link from "next/link";
import { useState } from "react";

type Props = { mode: "login" | "register" };
export default function MarketplaceAuthForm({ mode }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const isRegister = mode === "register";
  const strength = [password.length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Form UI is ready. Supabase authentication, Google OAuth and account persistence will be connected in the next backend phase.");
  }
  return <main className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-2">
    <section className="hidden lg:block">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c75b45]">UMEED MARKETPLACE</p>
      <h1 className="mt-5 max-w-lg text-5xl font-black leading-tight text-[#332923]">{isRegister ? "Your next favourite find starts here." : "Good to have you back."}</h1>
      <p className="mt-5 max-w-lg leading-8 text-[#82736c]">{isRegister ? "Create a buyer account to keep your delivery details, orders and product reviews together." : "Sign in to follow your orders, manage addresses and keep your shopping details in one place."}</p>
      <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
        {["Order updates", "Saved addresses", "Returns support", "Verified stores"].map((item) => <div key={item} className="rounded-2xl border border-[#f0e2dc] bg-white p-4 text-sm font-semibold text-[#62534b]"><span className="mr-2 text-[#d95e49]">✓</span>{item}</div>)}
      </div>
    </section>
    <section className="mx-auto w-full max-w-md rounded-[28px] border border-[#f0e2dc] bg-white p-6 shadow-[0_22px_65px_rgba(90,55,35,.08)] sm:p-9">
      <p className="text-sm font-bold text-[#c75b45]">BUYER ACCOUNT</p>
      <h2 className="mt-2 text-3xl font-black text-[#332923]">{isRegister ? "Create account" : "Sign in"}</h2>
      <p className="mt-2 text-sm leading-6 text-[#82736c]">{isRegister ? "Register with your details. Password strength is checked as you type." : "Use your registered email address and password."}</p>
      <button type="button" onClick={() => setNotice("Google sign-in will be enabled when Supabase Google OAuth is configured.")} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[#e9ddd7] px-4 py-3 text-sm font-bold text-[#40342f] transition hover:bg-[#fff8f4]"><span className="grid h-6 w-6 place-items-center rounded-full border border-[#e9ddd7] text-sm font-black">G</span>Continue with Google</button>
      <div className="my-5 flex items-center gap-3 text-xs text-[#a08d83]"><span className="h-px flex-1 bg-[#eee2dc]"/>OR WITH EMAIL<span className="h-px flex-1 bg-[#eee2dc]"/></div>
      <form onSubmit={submit} className="space-y-4">
        {isRegister && <label className="block"><span className="mb-2 block text-sm font-semibold text-[#4a3b34]">Full name</span><input required autoComplete="name" className="w-full rounded-xl border border-[#e9ddd7] bg-white px-4 py-3 text-sm outline-none focus:border-[#d95e49]" placeholder="Your full name"/></label>}
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[#4a3b34]">Email address</span><input required type="email" autoComplete="email" className="w-full rounded-xl border border-[#e9ddd7] bg-white px-4 py-3 text-sm outline-none focus:border-[#d95e49]" placeholder="you@example.com"/></label>
        {isRegister && <label className="block"><span className="mb-2 block text-sm font-semibold text-[#4a3b34]">Phone number</span><input required type="tel" autoComplete="tel" className="w-full rounded-xl border border-[#e9ddd7] bg-white px-4 py-3 text-sm outline-none focus:border-[#d95e49]" placeholder="03XX XXXXXXX"/></label>}
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[#4a3b34]">Password</span><div className="relative"><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-[#e9ddd7] bg-white px-4 py-3 pr-20 text-sm outline-none focus:border-[#d95e49]" placeholder={isRegister ? "At least 8 characters" : "Your password"}/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#c75b45]">{showPassword ? "Hide" : "Show"}</button></div>
        {isRegister && <div className="mt-2"><div className="flex gap-1">{[0,1,2,3,4].map(n=><span key={n} className={`h-1.5 flex-1 rounded-full ${strength>n ? "bg-[#d95e49]" : "bg-[#f0e2dc]"}`}/>)}</div><p className="mt-1 text-xs text-[#82736c]">{password.length===0 ? "Use uppercase, lowercase, a number and a symbol." : strength<3 ? "Weak password — add more character types." : strength<5 ? "Getting stronger — add missing character types." : "Strong password."}</p></div>}
        </label>
        {notice && <p role="status" className="rounded-xl border border-[#f0d6ca] bg-[#fff7f2] p-3 text-sm leading-6 text-[#8f4938]">{notice}</p>}
        <button className="w-full rounded-xl bg-[#df604b] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#c94b38]" type="submit">{isRegister ? "Create buyer account" : "Sign in securely"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#82736c]">{isRegister ? "Already have an account? " : "New to Umeed Marketplace? "}<Link className="font-bold text-[#c75b45]" href={isRegister ? "/marketplace/login" : "/marketplace/register"}>{isRegister ? "Sign in" : "Create account"}</Link></p>
      <p className="mt-4 text-center text-xs text-[#a08d83]">Vendor access is separate: <Link className="font-bold text-[#c75b45]" href="/marketplace/vendor/login">Vendor sign in</Link></p>
    </section>
  </main>;
}
