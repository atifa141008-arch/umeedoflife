"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ManagementForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/management/reset-password`,
      });
      if (resetError) throw resetError;
      setMessage("If this email belongs to an account, a password recovery link will be sent. Check your inbox and spam folder.");
    } catch {
      setError("We could not start password recovery. Check your Supabase configuration and try again.");
    } finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#fff8f4] px-4 py-10"><section className="w-full max-w-md rounded-[28px] border border-[#f1ddd4] bg-white p-7 shadow-xl shadow-[#c54c36]/5 sm:p-9"><Link href="/management/login" className="text-sm font-bold text-[#a14a36] hover:underline">← Back to management sign in</Link><span className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e8] text-2xl text-[#c54c36]">⌁</span><h1 className="mt-5 text-2xl font-black text-[#44251e]">Recover management access</h1><p className="mt-2 text-sm leading-6 text-[#98766c]">Enter the email address for your authorized management account. Supabase will send a time-limited recovery link.</p><form onSubmit={submit} className="mt-7 space-y-4"><label htmlFor="email" className="block text-sm font-bold text-[#65463d]">Management email</label><input id="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full rounded-xl border border-[#ead8d0] bg-[#fffdfc] px-4 py-3.5 text-base outline-none focus:border-[#c54c36] focus:ring-4 focus:ring-[#c54c36]/10" />{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-800">{message}</p>}<button disabled={busy} className="w-full rounded-xl bg-[#c54c36] px-4 py-3.5 text-sm font-extrabold text-white hover:bg-[#a93d2a] disabled:opacity-60">{busy ? "Sending recovery link…" : "Send recovery link"}</button></form><p className="mt-6 text-xs leading-5 text-[#a9877d]">Recovery uses Supabase Auth. No password or recovery token is stored in this page or in a separate secret file.</p></section></main>;
}
