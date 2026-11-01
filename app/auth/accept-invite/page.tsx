"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function AcceptInviteForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initializeSession() {
      try {
        const supabase = createClient();

        const hash = window.location.hash;
        const params = new URLSearchParams(
          hash.startsWith("#") ? hash.slice(1) : hash
        );

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw new Error(
              "This link is invalid or expired. Please request a new email."
            );
          }

          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          throw new Error(
            "Your account setup session is missing or expired. Please open a fresh invitation or recovery email."
          );
        }

        if (!cancelled) {
          setSessionReady(true);
          setMessage("Create a secure password for your account.");
        }
      } catch (error) {
        if (!cancelled) {
          setSessionReady(false);
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to verify this link. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initializeSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!sessionReady) {
      setMessage("Your account setup session is invalid or expired.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Your session has expired. Please request a new email.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(error.message);
        return;
      }

      await supabase.auth.signOut();

      router.replace("/management/login?message=password-set");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8f5] px-4 py-10">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#173f32]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#b7792b]/10 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#e1e9e3] bg-white shadow-2xl lg:grid-cols-2">
        <section className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-[#173f32] p-8 text-white sm:p-12 lg:min-h-[650px]">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />

          <a href="/" className="relative flex w-fit items-center">
            <Image
              src="/images/umeed-logo2.png"
              alt="Umeed of Life Logo"
              width={300}
              height={200}
              priority
              className="h-auto w-[190px] object-contain sm:w-[230px]"
            />
          </a>

          <div className="relative py-10">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#e7c58c]">
              Secure Account Setup
            </span>

            <h1 className="mt-7 text-4xl font-black leading-tight sm:text-5xl">
              Your journey.
              <span className="block text-[#d6a65d]">
                Your opportunity.
              </span>
              Your future.
            </h1>

            <p className="mt-6 max-w-md leading-8 text-white/70">
              Create a secure password to activate your Umeed of Life
              employee account and access your authorized workspace.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Secure account activation",
                "Protected employee access",
                "Permission-based management",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b7792b] text-xs font-black">
                    ✓
                  </span>
                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-white/45">
            Umeed of Life · Secure Employee Portal
          </p>
        </section>

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
                Account Security
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f32] sm:text-4xl">
                Set Your Password
              </h2>

              <p className="mt-4 leading-7 text-[#687870]">
                Create a strong password to activate or recover access to
                your account.
              </p>
            </div>

            {loading ? (
              <div className="mt-9 rounded-2xl border border-[#e1e9e3] bg-[#f8faf8] p-5 text-sm text-[#687870]">
                Verifying your secure account link...
              </div>
            ) : (
              <>
                {sessionReady ? (
                  <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-bold text-[#34473d]"
                      >
                        New Password
                      </label>

                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          minLength={8}
                          maxLength={128}
                          required
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 pr-20 outline-none transition focus:border-[#173f32] focus:ring-4 focus:ring-[#173f32]/10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#687870]"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-bold text-[#34473d]"
                      >
                        Confirm Password
                      </label>

                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          minLength={8}
                          maxLength={128}
                          required
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Enter password again"
                          className="w-full rounded-2xl border border-[#dfe7e2] bg-[#fbfcfb] px-4 py-4 pr-20 outline-none transition focus:border-[#173f32] focus:ring-4 focus:ring-[#173f32]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#687870]"
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    {message && (
                      <p
                        role="status"
                        className="rounded-xl border border-[#e1e9e3] bg-[#f8faf8] p-4 text-sm leading-6 text-[#34473d]"
                      >
                        {message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-2xl bg-[#173f32] px-6 py-4 font-bold text-white shadow-lg shadow-[#173f32]/10 transition hover:bg-[#235746] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving Password..." : "Set Password"}
                    </button>

                    <p className="text-center text-xs leading-6 text-[#87948d]">
                      Use at least 8 characters. Never share your password
                      with anyone.
                    </p>
                  </form>
                ) : (
                  <div className="mt-9 space-y-5">
                    <p
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                    >
                      {message}
                    </p>

                    <a
                      href="/management/login"
                      className="block w-full rounded-2xl bg-[#173f32] px-6 py-4 text-center font-bold text-white transition hover:bg-[#235746]"
                    >
                      Return to Login
                    </a>
                  </div>
                )}
              </>
            )}

            <p className="mt-8 text-center text-xs leading-6 text-[#87948d]">
              © {new Date().getFullYear()} Umeed of Life. All rights reserved.
              <br />
              Secure Account Setup
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f8f5] text-[#173f32]">
          Loading secure account setup...
        </main>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}