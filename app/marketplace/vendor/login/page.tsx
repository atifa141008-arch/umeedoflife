"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (loginError || !data.user) {
        setError("Login failed. Please check your email and password.");
        return;
      }
      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        setError("Please verify your email address before signing in.");
        return;
      }
      const response = await fetch("/api/marketplace/vendor/products", { cache: "no-store" });
      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        setError("Your account does not have access to an approved, active vendor store.");
        return;
      }
      if (!response.ok) {
        setError("We couldn't verify your store right now. Please try again.");
        return;
      }
      router.replace("/marketplace/vendor/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff7f3] px-4 py-10 text-[#402820]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#e16c58]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#f0a96b]/15 blur-3xl" />
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#f2ddd4] bg-white shadow-2xl shadow-[#a45b43]/10 lg:grid-cols-2">
        <section className="relative flex min-h-[350px] flex-col justify-between overflow-hidden bg-[#8f302d] p-8 text-white sm:p-12 lg:min-h-[680px]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />
          <Link href="/marketplace" className="relative flex w-fit items-center justify-center">
            <Image src="/images/umeed-marketplace-logo.png" alt="Umeed of Life official logo" width={300} height={200} priority className="h-auto w-[190px] object-contain sm:w-[230px]" />
          </Link>
          <div className="relative py-10">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ffd5a8]">Umeed Marketplace</span>
            <h1 className="mt-7 text-4xl font-black leading-tight sm:text-5xl">
              Your store.<span className="block text-[#ffc48e]">Your growth.</span>Your future.
            </h1>
            <p className="mt-6 max-w-md leading-8 text-white/75">A dedicated workspace to manage your products and grow your business with Umeed Marketplace.</p>
            <div className="mt-9 space-y-4">
              {["Your own secure vendor account", "Manage products and inventory", "A marketplace built for opportunity"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e87c59] text-xs font-black">✓</span>
                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="relative text-xs text-white/50">Only approved and active vendors can access this workspace.</p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-12 lg:p-14">
          <div className="w-full max-w-md">
            <Link href="/marketplace" className="text-sm font-semibold text-[#89736a] transition hover:text-[#a53e36]">← Back to Marketplace</Link>
            <div className="mt-10">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c25b43]">Secure Vendor Access</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#622d29] sm:text-4xl">Welcome back</h2>
              <p className="mt-4 leading-7 text-[#89736a]">Sign in with the email and password you used when registering your store.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-9 space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#56372f]">Registered Email Address</label>
                <input id="email" name="email" type="email" required autoComplete="username" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" className="w-full rounded-2xl border border-[#efdcd3] bg-[#fffbf9] px-4 py-4 outline-none transition placeholder:text-[#b4a19a] focus:border-[#c75243] focus:ring-4 focus:ring-[#c75243]/10" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#56372f]">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-2xl border border-[#efdcd3] bg-[#fffbf9] px-4 py-4 pr-24 outline-none transition placeholder:text-[#b4a19a] focus:border-[#c75243] focus:ring-4 focus:ring-[#c75243]/10" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#98776c] transition hover:text-[#a53e36]">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              {error && <p role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#c75243] px-6 py-4 font-bold text-white shadow-lg shadow-[#c75243]/15 transition hover:bg-[#a93f35] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : "Sign In to Vendor Dashboard"}</button>
              <div className="rounded-2xl border border-[#f1e2da] bg-[#fff9f5] p-4">
                <p className="text-sm font-bold text-[#56372f]">Protected vendor access</p>
                <p className="mt-2 text-xs leading-6 text-[#89736a]">Registration alone does not grant store access. Your application must be approved and your store activated by Umeed Marketplace.</p>
              </div>
            </form>
            <p className="mt-7 text-center text-sm text-[#89736a]">New to Marketplace? <Link href="/marketplace/vendors/registration" className="font-bold text-[#bd4e3f] hover:underline">Apply as a vendor</Link></p>
            <p className="mt-7 text-center text-xs leading-6 text-[#aa958d]">© 2026 Umeed of Life. All rights reserved.<br />Umeed Marketplace Vendor Portal</p>
          </div>
        </section>
      </div>
    </main>
  );
}
