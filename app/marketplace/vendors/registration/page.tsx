"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import VendorRegHeader from "../../components/VendorRegHeader";

type FormData = {
  applicantName: string; businessName: string; email: string; phone: string;
  city: string; businessType: string; businessDescription: string;
  website: string; password: string; confirmPassword: string; termsAccepted: boolean;
};
const emptyForm: FormData = {
  applicantName: "", businessName: "", email: "", phone: "", city: "",
  businessType: "", businessDescription: "", website: "", password: "",
  confirmPassword: "", termsAccepted: false,
};
const businessTypes = [
  "Fashion & Clothing", "Electronics", "Home & Living", "Beauty & Personal Care",
  "Food & Grocery", "Food & Beverages", "Health & Wellness", "Books & Stationery",
  "Handmade Products", "Mobile & Accessories", "Computers & Technology",
  "Sports & Fitness", "Toys & Games", "Jewelry & Accessories", "Automotive",
  "Furniture", "Services", "Manufacturer", "Wholesaler", "Retailer", "Other",
];
const inputStyle = "mt-2 w-full rounded-xl border border-[#eadbd5] bg-white px-4 py-3 text-[#302521] outline-none transition focus:border-[#df584c] focus:ring-4 focus:ring-[#df584c]/10";

export default function VendorRegistrationPage() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ id: string; status: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    if (form.password.length < 12 || !/[a-z]/.test(form.password) ||
      !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)) {
      setError("Password must be at least 12 characters with uppercase, lowercase, a number and a symbol.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/marketplace/vendors/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applicantName: form.applicantName.trim(), businessName: form.businessName.trim(),
          email: form.email.trim().toLowerCase(), phone: form.phone.trim(),
          city: form.city.trim(), businessDescription: form.businessDescription.trim(),
          website: form.website.trim(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Registration failed. Please try again.");
      }
      setSuccess({ id: result.application?.id ?? "", status: result.application?.status ?? "Pending" });
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf8] text-[#302521]">
      <VendorRegHeader />
      <section className="border-b border-[#f6dfd8] bg-gradient-to-br from-[#fff0e9] via-white to-[#fff7f4] px-5 py-14 text-center sm:py-20">
        <span className="rounded-full border border-[#f3c7b8] bg-white px-4 py-2 text-sm font-bold text-[#c94d42]">Umeed Marketplace</span>
        <h1 className="mt-7 text-4xl font-extrabold sm:text-5xl">Grow Your Business <span className="text-[#df584c]">With Umeed</span></h1>
        <p className="mx-auto mt-5 max-w-2xl text-[#786b66]">Create your secure vendor account, verify your email and submit your business for management approval.</p>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:py-16">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-widest text-[#df584c]">Become a vendor</p>
          <h2 className="mt-3 text-3xl font-extrabold">Your journey starts here.</h2>
          <p className="mt-4 leading-7 text-[#786b66]">Your store stays private until management approves and activates it. Registration is free during the initial launch.</p>
          <ol className="mt-8 space-y-5">
            {[
              ["01", "Register & verify", "Create a password and confirm your email address."],
              ["02", "Management review", "Your business application is reviewed by the team."],
              ["03", "Approval & activation", "After activation, you can manage your store and products."],
            ].map(([number, title, description]) => (
              <li key={number} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffe4dc] font-bold text-[#cf5145]">{number}</span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#82736d]">{description}</p></div>
              </li>
            ))}
          </ol>
          <Link href="/marketplace" className="mt-8 inline-block font-semibold text-[#cf5145] hover:underline">← Back to Marketplace</Link>
        </aside>
        <div className="rounded-3xl border border-[#f2dfd9] bg-white p-5 shadow-[0_15px_60px_rgba(110,58,42,0.07)] sm:p-8 lg:p-10">
          {success ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl text-green-700">✓</div>
              <h2 className="mt-6 text-3xl font-extrabold">Application submitted!</h2>
              <p className="mx-auto mt-4 max-w-lg leading-7 text-[#786b66]">Check your email for a verification link. Your application is pending management review and your store is not active yet.</p>
              {success.id && <div className="mt-6 rounded-xl bg-[#fff6f2] p-4 text-left text-sm"><p>Application reference</p><p className="mt-1 break-all font-mono font-bold">{success.id}</p><p className="mt-3">Status: <strong>{success.status}</strong></p></div>}
              <button type="button" onClick={() => setSuccess(null)} className="mt-7 rounded-xl bg-[#df584c] px-6 py-3 font-bold text-white">New registration</button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold sm:text-3xl">Vendor Registration</h2>
              <p className="mt-2 text-sm text-[#82736d]">Fields marked * are required. Keep your password private.</p>
              {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
              <form onSubmit={submit} className="mt-7 space-y-6">
                <div className="space-y-5">
                  <h3 className="font-bold">Personal Information</h3>
                  <label className="block text-sm font-semibold">Full Name *
                    <input required minLength={2} maxLength={100} autoComplete="name" className={inputStyle} value={form.applicantName} onChange={(e) => update("applicantName", e.target.value)} />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold">Email Address *
                      <input required type="email" maxLength={254} autoComplete="email" className={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} />
                    </label>
                    <label className="block text-sm font-semibold">Contact Number *
                      <input required type="tel" maxLength={30} autoComplete="tel" placeholder="+92 3XX XXXXXXX" className={inputStyle} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    </label>
                  </div>
                  <label className="block text-sm font-semibold">City *
                    <input required minLength={2} maxLength={100} className={inputStyle} value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </label>
                </div>
                <div className="space-y-5 border-t border-[#f1e6e2] pt-6">
                  <h3 className="font-bold">Business Information</h3>
                  <label className="block text-sm font-semibold">Business Name *
                    <input required minLength={2} maxLength={150} className={inputStyle} value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">Business Category *
                    <select required className={inputStyle} value={form.businessType} onChange={(e) => update("businessType", e.target.value)}>
                      <option value="">Select a category</option>
                      {businessTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold">About Your Business *
                    <textarea required minLength={20} maxLength={2000} rows={5} className={inputStyle} value={form.businessDescription} onChange={(e) => update("businessDescription", e.target.value)} />
                    <span className="mt-1 block text-right text-xs text-[#9a8a83]">{form.businessDescription.length}/2000 characters</span>
                  </label>
                  <label className="block text-sm font-semibold">Business Website (optional)
                    <input type="url" maxLength={500} placeholder="https://yourbusiness.com" className={inputStyle} value={form.website} onChange={(e) => update("website", e.target.value)} />
                  </label>
                </div>
                <div className="space-y-5 border-t border-[#f1e6e2] pt-6">
                  <h3 className="font-bold">Secure Login</h3>
                  <label className="block text-sm font-semibold">Password *
                    <input required type={showPassword ? "text" : "password"} minLength={12} maxLength={128} autoComplete="new-password" className={inputStyle} value={form.password} onChange={(e) => update("password", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">Confirm Password *
                    <input required type={showPassword ? "text" : "password"} minLength={12} maxLength={128} autoComplete="new-password" className={inputStyle} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
                  </label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="accent-[#df584c]" /> Show passwords</label>
                  <p className="text-xs leading-5 text-[#82736d]">At least 12 characters including uppercase, lowercase, number and symbol. Password is managed by Supabase Auth, not stored with your application.</p>
                </div>
                <div className="border-t border-[#f1e6e2] pt-6">
                  <label className="flex items-start gap-3 text-sm leading-6 text-[#756965]">
                    <input type="checkbox" required checked={form.termsAccepted} onChange={(e) => update("termsAccepted", e.target.checked)} className="mt-1 accent-[#df584c]" />
                    <span>I confirm my information is accurate and agree to management review. Registration does not automatically approve or activate my store. *</span>
                  </label>
                </div>
                <button disabled={loading} type="submit" className="w-full rounded-xl bg-[#df584c] px-6 py-4 font-bold text-white shadow-lg shadow-[#df584c]/20 transition hover:bg-[#c94a40] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Creating account and submitting..." : "Create Account & Submit Application →"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
      <footer className="border-t border-[#f0dfd9] bg-white px-5 py-7 text-center text-sm text-[#887973]"> <Link href="/marketplace/vendor" className="hover:text-[#df584c]">Vendor Information</Link></footer>
    </main>
  );
}
