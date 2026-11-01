"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const departments = [
  "General Enquiry",
  "Umeed Marketplace",
  "Umeed Essentials",
  "Marketing & Partnerships",
  "Careers",
  "Investor Relations",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "General Enquiry",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus(
      "The contact form interface is ready, but message delivery is not configured yet. Please connect a secure backend before accepting real enquiries."
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#17231d]">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#173f32]">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#b7792b]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-[#e8c68e]">
            WE ARE HERE TO HELP
          </span>

          <h1 className="mt-8 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Let&apos;s start a
            <span className="block text-[#d6a65d]">conversation.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Have a question, business proposal or partnership idea? Contact
            Umeed of Life and choose the department related to your enquiry.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Information */}
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b7792b]">
            Get in Touch
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#173f32] md:text-4xl">
            How can we help you?
          </h2>

          <p className="mt-5 leading-8 text-[#687870]">
            Send your enquiry to the appropriate team. As Umeed expands, this
            section can connect directly with our central customer support
            and department management systems.
          </p>

          <div className="mt-9 space-y-4">
            <div className="rounded-3xl border border-[#e3ebe6] bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f32]/10 text-xl">
                ✉
              </div>

              <h3 className="mt-4 font-black text-[#173f32]">
                Email Enquiries
              </h3>

              <p className="mt-2 text-sm leading-7 text-[#687870]">
                Official email address will be added after the company email
                system is configured.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e3ebe6] bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b7792b]/10 text-xl">
                ◈
              </div>

              <h3 className="mt-4 font-black text-[#173f32]">
                Business & Partnerships
              </h3>

              <p className="mt-2 text-sm leading-7 text-[#687870]">
                For seller partnerships, suppliers, marketing proposals and
                other business opportunities.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e3ebe6] bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f32]/10 text-xl">
                ↗
              </div>

              <h3 className="mt-4 font-black text-[#173f32]">
                Marketing & Communications
              </h3>

              <p className="mt-2 text-sm leading-7 text-[#687870]">
                Marketing enquiries will be routed to the authorized Marketing
                Head when the team contact details are configured.
              </p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-[2rem] border border-[#e3ebe6] bg-white p-6 shadow-sm sm:p-9">
          <h2 className="text-2xl font-black text-[#173f32]">
            Send an Enquiry
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#687870]">
            Complete the form below. Message delivery requires backend
            configuration.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-bold text-[#34473d]"
              >
                Full Name
              </label>

              <input
                id="name"
                required
                maxLength={100}
                autoComplete="name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#173f32] focus:ring-2 focus:ring-[#173f32]/10"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-[#34473d]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#173f32] focus:ring-2 focus:ring-[#173f32]/10"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-bold text-[#34473d]"
              >
                Enquiry Department
              </label>

              <select
                id="department"
                value={form.department}
                onChange={(event) =>
                  setForm({ ...form, department: event.target.value })
                }
                className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#173f32]"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-bold text-[#34473d]"
              >
                Subject
              </label>

              <input
                id="subject"
                required
                maxLength={150}
                value={form.subject}
                onChange={(event) =>
                  setForm({ ...form, subject: event.target.value })
                }
                placeholder="What is your enquiry about?"
                className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#173f32]"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-bold text-[#34473d]"
              >
                Message
              </label>

              <textarea
                id="message"
                required
                minLength={10}
                maxLength={3000}
                rows={5}
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                placeholder="Write your message here..."
                className="w-full resize-y rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 outline-none transition focus:border-[#173f32]"
              />

              <p className="mt-2 text-right text-xs text-[#87948d]">
                {form.message.length}/3000 characters
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#173f32] px-6 py-4 font-bold text-white transition hover:bg-[#235746]"
            >
              Validate Enquiry Form
            </button>

            {status && (
              <p
                role="status"
                className="rounded-2xl bg-[#fff6e8] p-4 text-sm leading-7 text-[#80551f]"
              >
                {status}
              </p>
            )}

            <p className="text-xs leading-6 text-[#87948d]">
              Please do not submit passwords, payment details or other
              sensitive information through this form.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}