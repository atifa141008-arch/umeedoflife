import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const noStore = { "Cache-Control": "private, no-store" };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function respond(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

async function vendorSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !user.email_confirmed_at) return { error: respond({ error: "Verified vendor login required." }, 401) };
  const admin = createAdminClient();
  const { data: vendor, error: lookupError } = await admin
    .from("vendor_applications")
    .select("id, business_name, status, is_active")
    .eq("user_id", user.id)
    .eq("status", "Approved")
    .eq("is_active", true)
    .maybeSingle();
  if (lookupError) return { error: respond({ error: "Unable to verify vendor account." }, 500) };
  if (!vendor) return { error: respond({ error: "No approved active store is linked to this account." }, 403) };
  return { admin, vendor };
}

export async function GET() {
  try {
    const session = await vendorSession();
    if (session.error) return session.error;
    const { admin, vendor } = session;
    if (!admin || !vendor) return respond({ error: "Vendor unavailable." }, 500);
    const [products, categories] = await Promise.all([
      admin.from("marketplace_products")
        .select("id, name, slug, description, price, compare_at_price, stock_quantity, status, is_active, category_id, created_at")
        .eq("vendor_application_id", vendor.id)
        .order("created_at", { ascending: false }).limit(100),
      admin.from("marketplace_categories")
        .select("id, name").eq("is_active", true).order("sort_order", { ascending: true }),
    ]);
    if (products.error || categories.error) return respond({ error: "Unable to load products." }, 500);
    return respond({ store: vendor.business_name, products: products.data ?? [], categories: categories.data ?? [] });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Vendor products GET failed:", error);
    return respond({ error: "Unexpected server error." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== request.nextUrl.origin) return respond({ error: "Invalid request origin." }, 403);
    const session = await vendorSession();
    if (session.error) return session.error;
    const { admin, vendor } = session;
    if (!admin || !vendor) return respond({ error: "Vendor unavailable." }, 500);
    let body: unknown;
    try { body = await request.json(); } catch { return respond({ error: "Invalid JSON." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return respond({ error: "Invalid input." }, 400);
    const input = body as Record<string, unknown>;
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const description = typeof input.description === "string" ? input.description.trim() : "";
    const price = input.price;
    const stock = input.stock_quantity;
    const categoryId = input.category_id;
    if (name.length < 3 || name.length > 150 || description.length > 5000 ||
        typeof price !== "number" || !Number.isFinite(price) || price <= 0 || price > 100000000 ||
        Math.round(price * 100) !== price * 100 ||
        typeof stock !== "number" || !Number.isSafeInteger(stock) || stock < 0 || stock > 1000000 ||
        typeof categoryId !== "string" || !uuid.test(categoryId)) {
      return respond({ error: "Check name (3-150), price, stock, and category." }, 400);
    }
    const { data: category, error: categoryError } = await admin.from("marketplace_categories")
      .select("id").eq("id", categoryId).eq("is_active", true).maybeSingle();
    if (categoryError || !category) return respond({ error: "Invalid category." }, 400);
    // Unique slug with random UUID; seller cannot choose vendor ID or publish status.
    const slug = `${name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 65) || "product"}-${crypto.randomUUID().slice(0, 12)}`;
    const { data, error } = await admin.from("marketplace_products").insert({
      vendor_application_id: vendor.id,
      category_id: categoryId,
      name, slug, description: description || null,
      price, stock_quantity: stock,
      status: "draft", is_active: false, is_featured: false,
    }).select("id, name, slug, status").single();
    if (error) {
      console.error("Vendor product insert failed:", error);
      return respond({ error: "Could not save product." }, 500);
    }
    return respond({ success: true, product: data }, 201);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Vendor products POST failed:", error);
    return respond({ error: "Unexpected server error." }, 500);
  }
}
