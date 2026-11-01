"use client";

import Link from "next/link";
import { useState } from "react";
import MarketplaceHeader from "../../components/MarketplaceHeader";

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const score = passwordScore(password);
  const strength = password.length === 0 ? "Add a password" : score <= 2 ? "Weak" : score <= 3 ? "Fair" : score === 4 ? "Strong" : "Very strong";

  return (
    <main className="mp-shell min-h-screen">
      <MarketplaceHeader />
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[.85fr_1fr] lg:gap-16">
        <section className="pt-2 lg:pt-12"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#c76a53]">GET STARTED</p><h1 className="mt-3 max-w-lg text-4xl font-black leading-tight tracking-tight sm:text-5xl">A simpler way to shop.</h1><p className="mt-5 max-w-lg text-base leading-8 text-[#82736c]">Create your Umeed Marketplace account with five simple details. Keep your account information accurate so you can use it for future marketplace updates.</p><div className="mt-8 space-y-4">{[{n:"01",title:"One account",text:"Keep your marketplace activity connected."},{n:"02",title:"Your details",text:"Use a reachable email and phone number."},{n:"03",title:"A strong password",text:"Choose a unique password you do not use elsewhere."}].map(item=><div key={item.n} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-sm font-black text-[#bd5945]">{item.n}</span><div><h2 className="text-sm font-extrabold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-[#82736c]">{item.text}</p></div></div>)}</div></section>
        <section className="mx-auto w-full max-w-xl rounded-[28px] border border-[#f0e3dc] bg-white p-6 shadow-[0_24px_70px_rgba(112,70,48,.09)] sm:p-9">
          <p className="text-sm font-bold text-[#bd5945]">Buyer account</p><h2 className="mt-2 text-2xl font-black tracking-tight">Create your account</h2><p className="mt-2 text-sm leading-6 text-[#82736c]">Complete all five fields to get started.</p>
          <form onSubmit={(event) => { event.preventDefault(); setMessage("Registration is a UI preview only. Secure account creation is not connected in this frontend package, so your details were not sent or saved."); }} className="mt-7 space-y-4">
            <label className="block"><span className="mp-label">Full name</span><input className="mp-input" required type="text" autoComplete="name" placeholder="Your full name" /></label>
            <label className="block"><span className="mp-label">Email address</span><input className="mp-input" required type="email" autoComplete="email" placeholder="you@example.com" /></label>
            <label className="block"><span className="mp-label">Phone number</span><input className="mp-input" required type="tel" autoComplete="tel" placeholder="03XX XXXXXXX" /></label>
            <label className="block"><span className="mp-label">City</span><input className="mp-input" required type="text" autoComplete="address-level2" placeholder="Your city" /></label>
            <label className="block"><span className="mp-label">Password</span><div className="relative"><input className="mp-input pr-20" required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a strong password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-[#bd5945]">{showPassword ? "Hide" : "Show"}</button></div><div className="mt-3"><div className="flex items-center justify-between gap-2 text-xs"><span className="text-[#82736c]">Password strength</span><span className={`font-bold ${score >= 4 ? "text-emerald-700" : score >= 3 ? "text-amber-700" : "text-[#bd5945]"}`}>{strength}</span></div><div className="mt-2 grid grid-cols-5 gap-1" aria-hidden="true">{[1,2,3,4,5].map((n)=><span key={n} className={`h-1.5 rounded-full ${score >= n ? (score >= 4 ? "bg-emerald-500" : score >= 3 ? "bg-amber-500" : "bg-[#df604b]") : "bg-[#f0e3dc]"}`} />)}</div><p className="mt-2 text-xs leading-5 text-[#92847d]">Use 8+ characters, upper/lowercase letters, a number and a symbol for a stronger password.</p></div></label>
            {message ? <p role="status" className="rounded-xl border border-[#f0d6ca] bg-[#fff7f2] p-3 text-sm leading-6 text-[#9b4c3a]">{message}</p> : null}
            <button className="mp-primary mt-2 w-full" type="submit">Create account <span aria-hidden>→</span></button>
          </form>
          <p className="mt-5 text-center text-sm text-[#82736c]">Already have an account? <Link href="/marketplace/account/login" className="font-bold text-[#bd5945]">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
