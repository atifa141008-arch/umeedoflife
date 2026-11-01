import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);

      return NextResponse.redirect(
        new URL("/management/login?error=signout", request.url),
        { status: 303 }
      );
    }

    return NextResponse.redirect(
      new URL("/management/login?success=signedout", request.url),
      { status: 303 }
    );
  } catch (error) {
    console.error("Sign out route error:", error);

    return NextResponse.redirect(
      new URL("/management/login?error=server", request.url),
      { status: 303 }
    );
  }
}