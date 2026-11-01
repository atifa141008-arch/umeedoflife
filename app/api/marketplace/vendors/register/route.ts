import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

const businessTypes = new Set([
  "Electronics", "Fashion & Clothing", "Food & Beverages", "Food & Grocery",
  "Home & Living", "Beauty & Personal Care", "Health & Wellness",
  "Books & Stationery", "Mobile & Accessories", "Computers & Technology",
  "Sports & Fitness", "Toys & Games", "Jewelry & Accessories",
  "Automotive", "Furniture", "Services", "Manufacturer", "Wholesaler",
  "Retailer", "Handmade Products", "Other",
]);

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const fail = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  try {
    // Reject cross-origin browser submissions. This is not a replacement for rate limiting.
    const origin = request.headers.get("origin");
    const requestOrigin = new URL(request.url).origin;
    if (origin && origin !== requestOrigin) return fail("Invalid request origin.", 403);
    if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
      return fail("JSON request required.", 415);
    }
    const raw = await request.text();
    if (raw.length > 15000) return fail("Application is too large.", 413);
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { return fail("Invalid registration information.", 400); }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail("Invalid registration information.", 400);
    const input = parsed as Record<string, unknown>;
    const applicantName = clean(input.applicantName);
    const businessName = clean(input.businessName);
    const email = clean(input.email).toLowerCase();
    const phone = clean(input.phone);
    const city = clean(input.city);
    const businessType = clean(input.businessType);
    const businessDescription = clean(input.businessDescription);
    const website = clean(input.website);
    const password = typeof input.password === "string" ? input.password : "";
    const confirmPassword = typeof input.confirmPassword === "string" ? input.confirmPassword : "";

    if (applicantName.length < 2 || businessName.length < 2 || city.length < 2 ||
      businessDescription.length < 20 || !email || !phone || !businessType) {
      return fail("Please complete all required fields.", 400);
    }
    if (applicantName.length > 100 || businessName.length > 150 || email.length > 254 ||
      phone.length > 30 || city.length > 100 || businessDescription.length > 2000 || website.length > 500) {
      return fail("One or more fields exceed the allowed length.", 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email address.", 400);
    if (!/^[0-9+()\s-]{7,30}$/.test(phone)) return fail("Please enter a valid contact number.", 400);
    if (!businessTypes.has(businessType)) return fail("Please select a valid business type.", 400);
    if (input.termsAccepted !== true) return fail("Please accept the registration declaration.", 400);
    if (password.length < 12 || password.length > 128 || !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return fail("Use a password of 12–128 characters with uppercase, lowercase, number and symbol.", 400);
    }
    if (password !== confirmPassword) return fail("Passwords do not match.", 400);
    if (website) {
      try {
        const url = new URL(website);
        if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".")) throw new Error("invalid");
      } catch { return fail("Please enter a valid website URL.", 400); }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) return fail("Registration service is unavailable.", 503);
    const admin = createAdminClient();

    // A unique constraint on vendor_applications.user_id is recommended at database level.
    const { data: existing, error: lookupError } = await admin
      .from("vendor_applications").select("id").eq("email", email).limit(1);
    if (lookupError) {
      console.error("Vendor duplicate lookup failed:", lookupError.code);
      return fail("Registration is temporarily unavailable.", 503);
    }
    if (existing?.length) return fail("An application already exists for this email. Please contact management.", 409);

    // Public Auth signup: never create a privileged account and never save the password in application tables.
    const auth = createClient(supabaseUrl, publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const { data: signup, error: signupError } = await auth.auth.signUp({
      email, password,
      options: { data: { full_name: applicantName } },
    });
    if (signupError) {
      console.error("Vendor signup failed:", signupError.code);
      return fail("Could not create account. Check your email and password, or contact support if already registered.", 400);
    }
    // Supabase can return a masked user for an existing email. Never link that user.
    if (!signup.user?.id || signup.user.identities?.length === 0) {
      return fail("This email may already have an account. Please use account recovery or contact management.", 409);
    }
    const authUserId = signup.user.id;
    const { data: application, error: insertError } = await admin
      .from("vendor_applications")
      .insert({
        user_id: authUserId,
        applicant_name: applicantName,
        business_name: businessName,
        email, phone, city, business_type: businessType,
        business_description: businessDescription,
        website: website || null,
        status: "Pending", is_active: false,
      })
      .select("id, status, created_at")
      .single();

    if (insertError) {
      console.error("Vendor application insert failed:", insertError.code);
      // Compensation only for an account newly created by this request.
      const { error: cleanupError } = await admin.auth.admin.deleteUser(authUserId);
      if (cleanupError) console.error("Vendor signup cleanup failed:", cleanupError.code);
      return fail("Application could not be saved. Please contact management.", 500);
    }
    return NextResponse.json({
      success: true,
      message: "Account created. Check your email to verify it. Your application is pending management approval.",
      application: { id: application.id, status: application.status, createdAt: application.created_at },
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Vendor registration error:", error);
    return fail("Registration is temporarily unavailable. Please try again.", 500);
  }
}
