import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next");

  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/auth/accept-invite";

  const supabase = await createClient();

  // Standard Supabase PKCE callback
  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(safeNext, url.origin)
      );
    }

    console.error("Invitation code exchange failed:", error.message);
  }

  // Support Supabase email links that provide a token hash
  if (tokenHash && type === "invite") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "invite",
    });

    if (!error) {
      return NextResponse.redirect(
        new URL(safeNext, url.origin)
      );
    }

    console.error("Invitation token verification failed:", error.message);
  }

  // Show a useful error instead of silently losing the invitation flow
  const errorUrl = new URL("/management/login", url.origin);
  errorUrl.searchParams.set("error", "invite");

  return NextResponse.redirect(errorUrl);
}