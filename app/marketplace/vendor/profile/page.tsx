"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type Vendor = { business_name: string; applicant_name: string; email: string; phone: string; city: string; business_description: string; website: string | null };
type Profile = { pickup_contact_name: string; pickup_phone: string; pickup_address_line1: string; pickup_address_line2: string; pickup_city: string; pickup_province: string; pickup_postal_code: string; store_support_phone: string; store_description: string };
type Payout = { bank_name: string; account_holder_name: string; iban_masked: string; verification_status: string; updated_at: string };
const empty: Profile = { pickup_contact_name: "", pickup_phone: "", pickup_address_line1: "", pickup_address_line2: "", pickup_city: "", pickup_province: "", pickup_postal_code: "", store_support_phone: "", store_description: "" };
const fields: { key: keyof Profile; label: string; required?: boolean; placeholder?: string }[] = [
  { key: "pickup_contact_name", label: "Pickup contact person", required: true },
  { key: "pickup_phone", label: "Pickup phone", required: true },
  { key: "pickup_address_line1", label: "Pickup address", required: true },
  { key: "pickup_address_line2", label: "Address line 2 (optional)" },
  { key: "pickup_city", label: "Pickup city", required: true },
  { key: "pickup_province", label: "Province" },
  { key: "pickup_postal_code", label: "Postal code" },
  { key: "store_support_phone", label: "Customer support phone" },
];
export default function SellerProfilePage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [profile, setProfile] = useState<Profile>(empty);
  const [payout, setPayout] = useState<Payout | null>(null);
  const [bankName, setBankName] = useState("");
  const [holder, setHolder] = useState("");
  const [iban, setIban] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/marketplace/vendor/profile", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not load profile."); return; }
      setVendor(data.vendor);
      setProfile({ ...empty, ...(data.profile || {}) });
      setPayout(data.payout);
      setError("");
    } catch { setError("Connection failed. Please try again."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function save(payload: Record<string, unknown>, success: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const res = await fetch("/api/marketplace/vendor/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Unable to save."); return; }
      setNotice(success);
      setIban("");
      await load();
    } catch { setError("Connection failed. Please try again."); }
    finally { setBusy(false); }
  }
  function saveProfile(e: FormEvent<HTMLFormElement>) { e.preventDefault(); void save({ action: "profile", ...profile }, "Pickup and store details saved."); }
  function savePayout(e: FormEvent<HTMLFormElement>) { e.preventDefault(); void save({ action: "payout", bank_name: bankName, account_holder_name: holder, iban }, "Bank account submitted for verification. It is not yet approved for payouts."); }
  const inputClass = "mt-2 w-full rounded-2xl border border-[#edd8d0] bg-[#fffdfb] px-4 py-3.5 text-[#44251e] outline-none transition focus:border-[#ce5544] focus:ring-4 focus:ring-[#ce5544]/10";
  return <main className="text-[#44251e]">
    <div className="max-w-5xl space-y-7">
      <header className="rounded-[2rem] bg-gradient-to-br from-[#8e302b] to-[#df7258] p-7 text-white shadow-xl shadow-[#d86d58]/15 sm:p-10">
        <Link href="/marketplace/vendor/dashboard" className="text-sm font-bold text-white/85 hover:text-white">← Seller Dashboard</Link>
        <p className="mt-9 text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffe1c5]">Umeed Marketplace · Seller Center</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Store Profile & Payouts</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">Manage your pickup information and submit your bank details for management verification.</p>
      </header>
      {loading && <p className="rounded-2xl bg-white p-5">Loading seller profile...</p>}
      {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
      {vendor && <>
        <section className="rounded-[2rem] border border-[#f1ddd5] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black">Registered Business</h2><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Approved & Active</span></div>
          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            {[["Store", vendor.business_name], ["Owner", vendor.applicant_name], ["Registered email", vendor.email], ["Registered phone", vendor.phone], ["City", vendor.city], ["Website", vendor.website || "Not provided"]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#fff8f4] p-4"><p className="text-xs font-semibold text-[#94746b]">{label}</p><p className="mt-1 break-words font-bold">{value}</p></div>)}
          </div>
          <p className="mt-4 text-xs leading-6 text-[#94746b]">Registered legal business details are read-only here. Management review will be required for changes.</p>
        </section>
        <form onSubmit={saveProfile} className="rounded-[2rem] border border-[#f1ddd5] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black">Pickup & Store Information</h2>
          <p className="mt-2 text-sm leading-6 text-[#92756b]">Umeed Management will use this address to arrange rider pickup after you mark an order Ready for Pickup.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map(f => <label key={f.key} className={`block text-sm font-bold ${f.key === "pickup_address_line1" || f.key === "pickup_address_line2" ? "sm:col-span-2" : ""}`}>{f.label}{f.required ? " *" : ""}<input required={f.required} value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} className={inputClass} /></label>)}
            <label className="block text-sm font-bold sm:col-span-2">Public store description<textarea rows={4} maxLength={1500} value={profile.store_description} onChange={e => setProfile(p => ({ ...p, store_description: e.target.value }))} className={inputClass} /></label>
          </div>
          <button disabled={busy} className="mt-7 rounded-2xl bg-[#c94f40] px-7 py-3.5 font-bold text-white hover:bg-[#a83d32] disabled:opacity-60">{busy ? "Saving..." : "Save Store & Pickup Details"}</button>
        </form>
        <section className="rounded-[2rem] border border-[#f1ddd5] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black">Payout Bank Account</h2>
          <p className="mt-2 text-sm leading-6 text-[#92756b]">Your bank details are private. Umeed Management must verify the account before payouts can be processed.</p>
          {payout && <div className="mt-5 rounded-2xl border border-[#f1ddd5] bg-[#fff8f4] p-5 text-sm">
            <p className="font-bold">{payout.bank_name} · {payout.iban_masked}</p>
            <p className="mt-1">Account holder: {payout.account_holder_name}</p>
            <p className="mt-2 font-bold">Verification: <span className="capitalize text-[#b54d3c]">{payout.verification_status}</span></p>
          </div>}
          <form onSubmit={savePayout} className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">Bank name *<input required maxLength={120} value={bankName} onChange={e => setBankName(e.target.value)} className={inputClass} placeholder="e.g. HBL" /></label>
            <label className="block text-sm font-bold">Account holder name *<input required maxLength={150} value={holder} onChange={e => setHolder(e.target.value)} className={inputClass} /></label>
            <label className="block text-sm font-bold sm:col-span-2">Pakistan IBAN *<input required maxLength={34} value={iban} onChange={e => setIban(e.target.value)} className={inputClass} placeholder="PK00 XXXX XXXX XXXX XXXX XXXX" autoComplete="off" spellCheck={false} /></label>
            <p className="text-xs leading-6 text-[#92756b] sm:col-span-2">Submitting a new bank account resets its verification to Pending. Do not enter passwords, PINs, or OTPs.</p>
            <div className="sm:col-span-2"><button disabled={busy} className="rounded-2xl bg-[#c94f40] px-7 py-3.5 font-bold text-white hover:bg-[#a83d32] disabled:opacity-60">{busy ? "Submitting..." : payout ? "Replace Bank Details & Request Verification" : "Submit Bank Account"}</button></div>
          </form>
        </section>
      </>}
    </div>
  </main>;
}
