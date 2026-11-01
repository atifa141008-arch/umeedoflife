"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ManagementResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (alive) { setReady(true); if (!data.session) setError("This recovery link is missing, expired, or already used. Request a new link."); }
    }).catch(() => { if (alive) { setReady(true); setError("Unable to verify this recovery session. Request a new link."); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (alive && session) { setError(""); setReady(true); }
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (password.length < 10) { setError("Use a password with at least 10 characters."); return; }
    if (password !== confirm) { setError("The passwords do not match."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Recovery session expired. Request a new link.");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      setMessage("Password updated. Please sign in using your new password.");
      setPassword(""); setConfirm("");
      window.setTimeout(() => router.replace("/management/login"), 1800);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Password could not be updated. Request a new recovery link.");
    } finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#fff8f4] px-4 py-10"><section className="w-full max-w-md rounded-[28px] border border-[#f1ddd4] bg-white p-7 shadow-xl shadow-[#c54c36]/5 sm:p-9"><Link href="/management/login" className="text-sm font-bold text-[#a14a36] hover:underline">← Management sign in</Link><span className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e8] text-2xl text-[#c54c36]">⌑</span><h1 className="mt-5 text-2xl font-black text-[#44251e]">Set a new password</h1><p className="mt-2 text-sm leading-6 text-[#98766c]">The recovery link must be valid in your current Supabase session.</p>{!ready ? <p className="mt-6 text-sm text-[#98766c]">Verifying recovery link…</p> : <form onSubmit={submit} className="mt-7 space-y-4"><div><label htmlFor="password" className="mb-2 block text-sm font-bold text-[#65463d]">New password</label><input id="password" type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-[#ead8d0] bg-[#fffdfc] px-4 py-3.5 text-base outline-none focus:border-[#c54c36] focus:ring-4 focus:ring-[#c54c36]/10" /></div><div><label htmlFor="confirm" className="mb-2 block text-sm font-bold text-[#65463d]">Confirm new password</label><input id="confirm" type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full rounded-xl border border-[#ead8d0] bg-[#fffdfc] px-4 py-3.5 text-base outline-none focus:border-[#c54c36] focus:ring-4 focus:ring-[#c54c36]/10" /></div>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}{message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-800">{message}</p>}<button disabled={busy || !ready || Boolean(message)} className="w-full rounded-xl bg-[#c54c36] px-4 py-3.5 text-sm font-extrabold text-white hover:bg-[#a93d2a] disabled:opacity-60">{busy ? "Updating password…" : "Update password"}</button></form>}<p className="mt-6 text-xs leading-5 text-[#a9877d]">Never share your recovery link. Supabase verifies the recovery session before accepting the password update.</p></section></main>;
}
