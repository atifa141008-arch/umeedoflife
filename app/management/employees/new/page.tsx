"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewEmployeePage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    employee_code: "",
    job_title: "",
    department: "",
    role: "EMPLOYEE",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.employee_code.trim() ||
      !form.job_title.trim() ||
      !form.department ||
      !form.role
    ) {
      setMessage("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/management/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Employee could not be created.");
        return;
      }

      setMessage(
        "Employee created successfully. Follow the account setup instructions provided by your administrator."
      );

      setForm({
        full_name: "",
        email: "",
        employee_code: "",
        job_title: "",
        department: "",
        role: "EMPLOYEE",
      });
    } catch {
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/management/employees"
          className="text-sm font-bold text-[#235746]"
        >
          ← Back to Employees
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#b68b45]">
            Central Administration
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#173f32]">
            Add New Employee
          </h1>

          <p className="mt-2 text-sm text-[#687870]">
            Enter the employee's information and organizational assignment.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={updateField}
            />

            <Field
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
            />

            <Field
              label="Employee Code"
              name="employee_code"
              value={form.employee_code}
              onChange={updateField}
            />

            <Field
              label="Job Title"
              name="job_title"
              value={form.job_title}
              onChange={updateField}
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-[#173f32]">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-[#dfe7e2] bg-white p-3 text-sm"
              >
                <option value="">Select Department</option>
                <option value="central">Central Administration</option>
                <option value="marketplace">Marketplace</option>
                <option value="essentials">Essentials</option>
                <option value="care">Care</option>
                <option value="workhub">WorkHub</option>
                <option value="global">Global</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#173f32]">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-[#dfe7e2] bg-white p-3 text-sm"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="DEPARTMENT_HEAD">Department Head</option>
              </select>
            </div>

            {message && (
              <p
                role="status"
                className="rounded-xl bg-[#edf5ef] p-4 text-sm text-[#235746]"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#173f32] px-5 py-4 font-bold text-white disabled:opacity-60"
            >
              {loading ? "Processing..." : "Create Employee"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#173f32]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-xl border border-[#dfe7e2] p-3 text-sm outline-none focus:border-[#235746]"
      />
    </div>
  );
}