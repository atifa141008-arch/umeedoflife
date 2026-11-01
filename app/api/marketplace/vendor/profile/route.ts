import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });

async function session() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email_confirmed_at) return { failure: reply({ error: "Verified login required." }, 401) };
  const admin = createAdminClient();
  const { data: vendor, error: vendorError } = await admin.from("vendor_applications")
    .select("id, business_name, applicant_name, email, phone, city, business_description, website")
    .eq("user_id", user.id).eq("status", "Approved").eq("is_active", true).maybeSingle();
  if (vendorError) return { failure: reply({ error: "Unable to verify store." }, 500) };
  if (!vendor) return { failure: reply({ error: "Active vendor account required." }, 403) };
  return { admin, vendor };
}

const profileFields = ["pickup_contact_name", "pickup_phone", "pickup_address_line1", "pickup_address_line2", "pickup_city", "pickup_province", "pickup_postal_code", "store_support_phone", "store_description"] as const;
const maxLen: Record<(typeof profileFields)[number], number> = {
  pickup_contact_name: 120, pickup_phone: 35, pickup_address_line1: 250,
  pickup_address_line2: 250, pickup_city: 100, pickup_province: 100,
  pickup_postal_code: 20, store_support_phone: 35, store_description: 1500,
};

export async function GET() {
  try {
    const s = await session(); if (s.failure) return s.failure;
    const { admin, vendor } = s; if (!admin || !vendor) return reply({ error: "Store unavailable." }, 500);
    const [profile, payout] = await Promise.all([
      admin.from("marketplace_vendor_profiles").select("*").eq("vendor_application_id", vendor.id).maybeSingle(),
      admin.from("marketplace_vendor_payout_accounts").select("bank_name, account_holder_name, iban, verification_status, updated_at").eq("vendor_application_id", vendor.id).maybeSingle(),
    ]);
    if (profile.error || payout.error) return reply({ error: "Unable to load seller profile. Run setup SQL first." }, 500);
    const account = payout.data;
    return reply({ vendor, profile: profile.data, payout: account ? {
      bank_name: account.bank_name, account_holder_name: account.account_holder_name,
      iban_masked: `•••• ${account.iban.slice(-4)}`,
      verification_status: account.verification_status, updated_at: account.updated_at,
    } : null });
  } catch (error) { unstable_rethrow(error); console.error("Seller profile GET:", error); return reply({ error: "Unexpected error." }, 500); }
}

export async function PUT(request: NextRequest) {
  try {
    if (request.headers.get("origin") !== request.nextUrl.origin) return reply({ error: "Invalid origin." }, 403);
    const s = await session(); if (s.failure) return s.failure;
    const { admin, vendor } = s; if (!admin || !vendor) return reply({ error: "Store unavailable." }, 500);
    let body: unknown; try { body = await request.json(); } catch { return reply({ error: "Invalid JSON." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid input." }, 400);
    const input = body as Record<string, unknown>;
    if (input.action === "profile") {
      const values: Record<string, string> = {};
      for (const field of profileFields) {
        if (typeof input[field] !== "string" || input[field].trim().length > maxLen[field])
          return reply({ error: `Invalid ${field}.` }, 400);
        values[field] = input[field].trim();
      }
      if (!values.pickup_contact_name || !values.pickup_phone || !values.pickup_address_line1 || !values.pickup_city)
        return reply({ error: "Pickup contact, phone, address and city are required." }, 400);
      const { error } = await admin.from("marketplace_vendor_profiles").upsert({
        vendor_application_id: vendor.id, ...values, updated_at: new Date().toISOString(),
      }, { onConflict: "vendor_application_id" });
      if (error) { console.error("Seller profile update:", error); return reply({ error: "Could not save profile." }, 500); }
      return reply({ success: true });
    }
    if (input.action === "payout") {
      const bank_name = typeof input.bank_name === "string" ? input.bank_name.trim() : "";
      const account_holder_name = typeof input.account_holder_name === "string" ? input.account_holder_name.trim() : "";
      const iban = typeof input.iban === "string" ? input.iban.replace(/\s/g, "").toUpperCase() : "";
      if (!bank_name || bank_name.length > 120 || !account_holder_name || account_holder_name.length > 150 || !/^PK[0-9]{2}[A-Z0-9]{20}$/.test(iban))
        return reply({ error: "Enter a valid bank, account holder and 24-character Pakistan IBAN." }, 400);
      const { error } = await admin.from("marketplace_vendor_payout_accounts").upsert({
        vendor_application_id: vendor.id, bank_name, account_holder_name, iban,
        verification_status: "pending", verified_by: null, verified_at: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "vendor_application_id" });
      if (error) { console.error("Seller payout update:", error); return reply({ error: "Could not submit payout account." }, 500); }
      return reply({ success: true, message: "Payout account submitted for management verification." });
    }
    return reply({ error: "Unknown action." }, 400);
  } catch (error) { unstable_rethrow(error); console.error("Seller profile PUT:", error); return reply({ error: "Unexpected error." }, 500); }
}
