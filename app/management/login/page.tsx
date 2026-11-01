"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function ManagementLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(
          "Login failed. Please check your email and password."
        );
        return;
      }

            // Get the authenticated user's ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        await supabase.auth.signOut();
        setError("Unable to verify your account. Please sign in again.");
        return;
      }

      // Check the employee profile
      const { data: profile, error: profileError } = await supabase
        .from("employee_profiles")
        .select("id, status")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile || profile.status !== "active") {
        await supabase.auth.signOut();
        setError(
          "Your management account is not active or has not been authorized."
        );
        return;
      }

      // Fetch the user's assigned central management roles
      const { data: roleAssignments, error: roleError } = await supabase
        .from("employee_roles")
        .select("roles(name), departments(slug)")
        .eq("employee_id", user.id);

      if (roleError) {
        await supabase.auth.signOut();
        setError("Unable to verify your management role. Please try again.");
        return;
      }

      const centralRoles = (roleAssignments ?? [])
        .filter((assignment: any) => {
          const department = Array.isArray(assignment.departments)
            ? assignment.departments[0]
            : assignment.departments;

          return department?.slug === "central";
        })
        .map((assignment: any) => {
          const role = Array.isArray(assignment.roles)
            ? assignment.roles[0]
            : assignment.roles;

          return String(role?.name ?? "")
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");
        });

      // Select the dashboard according to the assigned role
      let destination = "";

      if (centralRoles.includes("CEO")) {
        destination = "/management/ceo";
      } else if (
        centralRoles.includes("CO_CEO") ||
        centralRoles.includes("COCEO")
      ) {
        destination = "/management/co-ceo";
      } else if (
        centralRoles.includes("MANAGEMENT_HEAD") ||
        centralRoles.includes("MANAGMENT_HEAD") ||
        centralRoles.includes("CENTRAL_ADMIN")
      ) {
        destination = "/management/head";
      } else {
        await supabase.auth.signOut();
        setError(
          "Your account does not have an authorized central management role."
        );
        return;
      }

      router.replace(destination);
      router.refresh();
    } catch {
      setError(
        "Unable to connect. Please check your Supabase configuration."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8f5] px-4 py-10">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#173f32]/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#b7792b]/10 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#e1e9e3] bg-white shadow-2xl lg:grid-cols-2">
        {/* Branding Panel */}

        <section className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-[#173f32] p-8 text-white sm:p-12 lg:min-h-[680px]">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />

          <a
            href="/"
            className="relative flex w-fit items-center justify-center"
          >
            <Image
              src="/images/umeed-logo2.png"
              alt="Umeed of Life — Official Logo"
              width={300}
              height={200}
              priority
              className="h-auto w-[190px] object-contain sm:w-[230px]"
            />
          </a>

          <div className="relative py-10">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#e7c58c]">
              Central Management
            </span>

            <h1 className="mt-7 text-4xl font-black leading-tight sm:text-5xl">
              One vision.
              <span className="block text-[#d6a65d]">
                One ecosystem.
              </span>
              One future.
            </h1>

            <p className="mt-6 max-w-md leading-8 text-white/70">
              The central workspace for authorized leadership and
              management of the Umeed of Life ecosystem.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Central organizational management",
                "Department and employee administration",
                "Permission-based access control",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b7792b] text-xs font-black">
                    ✓
                  </span>

                  <span className="text-sm text-white/85">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-white/45">
            Authorized personnel only. All access must be verified.
          </p>
        </section>

        {/* Login Form */}

        <section className="flex items-center justify-center p-6 sm:p-12 lg:p-14">
          <div className="w-full max-w-md">
            <a
              href="/"
              className="text-sm font-semibold text-[#687870] transition hover:text-[#173f32]"
            >
              ← Back to website
            </a>

            <div className="mt-10">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b7792b]">
                Secure Access
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f32] sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-4 leading-7 text-[#687870]">
                Sign in with your authorized central management
                account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-9 space-y-6"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#34473d]"
                >
                  Official Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  maxLength={254}
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your official email"
                  className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 outline-none transition placeholder:text-[#a0aaa4] focus:border-[#173f32] focus:ring-4 focus:ring-[#173f32]/10"
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-[#34473d]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    maxLength={128}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 pr-24 outline-none transition placeholder:text-[#a0aaa4] focus:border-[#173f32] focus:ring-4 focus:ring-[#173f32]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#687870] transition hover:text-[#173f32]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="-mt-3 flex justify-end">
                <a href="/management/forgot-password" className="text-sm font-bold text-[#b94732] transition hover:text-[#8f3525] hover:underline">Forgot password?</a>
              </div>

              {/* Error Message */}

              {error && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Sign In Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#173f32] px-6 py-4 font-bold text-white shadow-lg shadow-[#173f32]/10 transition hover:bg-[#235746] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In to Management"}
              </button>

              {/* Security Notice */}

              <div className="rounded-2xl border border-[#e7ece8] bg-[#f8faf8] p-4">
                <p className="text-sm font-bold text-[#34473d]">
                  Protected management access
                </p>

                <p className="mt-2 text-xs leading-6 text-[#687870]">
                  Access must be granted by an authorized
                  administrator. An email address alone must never
                  grant CEO, Co-CEO, or investor privileges.
                </p>
              </div>
            </form>

            <p className="mt-8 text-center text-xs leading-6 text-[#87948d]">
              © 2026 Umeed of Life. All rights
reserved.
              <br />
              Central Management Portal
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}