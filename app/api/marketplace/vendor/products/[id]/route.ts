import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const headers = { "Cache-Control": "private, no-store" };
const reply = (data: object, status = 200) => NextResponse.json(data, { status, headers });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fields = ["brand", "model", "sku", "highlights", "specifications", "package_contents", "warranty"] as const;

async function session() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user?.email_confirmed_at) return { error: reply({ error: "Verified login required." }, 401) };
  const admin = createAdminClient();
  const { data: vendor, error } = await admin.from("vendor_applications").select("id")
    .eq("user_id", user.id).eq("status", "Approved").eq("is_active", true).maybeSingle();
  if (error) return { error: reply({ error: "Store lookup failed." }, 500) };
  if (!vendor) return { error: reply({ error: "Active vendor account required." }, 403) };
  return { admin, vendor };
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!uuid.test(id)) return reply({ error: "Invalid product ID." }, 400);
    const auth = await session();
    if (auth.error) return auth.error;
    const { data, error } = await auth.admin!.from("marketplace_products").select("*")
      .eq("id", id).eq("vendor_application_id", auth.vendor!.id).maybeSingle();
    if (error) return reply({ error: "Unable to load product." }, 500);
    if (!data) return reply({ error: "Product not found." }, 404);
    return reply({ product: data });
  } catch (error) { unstable_rethrow(error); console.error("Product GET", error); return reply({ error: "Server error." }, 500); }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (request.headers.get("origin") !== request.nextUrl.origin) return reply({ error: "Invalid origin." }, 403);
    const { id } = await context.params;
    if (!uuid.test(id)) return reply({ error: "Invalid product ID." }, 400);
    const auth = await session();
    if (auth.error) return auth.error;
    const admin = auth.admin!;
    const { data: existing, error: lookupError } = await admin.from("marketplace_products")
      .select("id,status").eq("id", id).eq("vendor_application_id", auth.vendor!.id).maybeSingle();
    if (lookupError) return reply({ error: "Product lookup failed." }, 500);
    if (!existing) return reply({ error: "Product not found." }, 404);
    if (existing.status !== "draft") return reply({ error: "Only draft products can be edited." }, 409);
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid input." }, 400);
    const input = body as Record<string, unknown>;
    const updates: Record<string, string | number | null> = {};
    for (const key of fields) {
      if (!(key in input)) continue;
      if (input[key] !== null && typeof input[key] !== "string") return reply({ error: `Invalid ${key}.` }, 400);
      const value = typeof input[key] === "string" ? input[key].trim() : "";
      if (value.length > (key === "specifications" || key === "highlights" ? 4000 : 500)) return reply({ error: `${key} is too long.` }, 400);
      updates[key] = value || null;
    }
    for (const key of ["weight_grams", "length_cm", "width_cm", "height_cm"] as const) {
      if (!(key in input)) continue;
      const value = input[key];
      if (value === null || value === "") { updates[key] = null; continue; }
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1000000 || (key === "weight_grams" && !Number.isInteger(value))) return reply({ error: `Invalid ${key}.` }, 400);
      updates[key] = value;
    }
    if ("name" in input) {
      if (typeof input.name !== "string" || input.name.trim().length < 3 || input.name.trim().length > 150) return reply({ error: "Invalid product name." }, 400);
      updates.name = input.name.trim();
    }
    if ("description" in input) {
      if (typeof input.description !== "string" || input.description.length > 5000) return reply({ error: "Invalid description." }, 400);
      updates.description = input.description.trim() || null;
    }
    if ("price" in input || "compare_at_price" in input) {
      for (const key of ["price", "compare_at_price"] as const) {
        if (!(key in input)) continue;
        const value = input[key];
        if (key === "compare_at_price" && (value === null || value === "")) { updates[key] = null; continue; }
        if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > 100000000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001) return reply({ error: `Invalid ${key}.` }, 400);
        updates[key] = value;
      }
    }
    if ("stock_quantity" in input) {
      if (typeof input.stock_quantity !== "number" || !Number.isSafeInteger(input.stock_quantity) || input.stock_quantity < 0 || input.stock_quantity > 1000000) return reply({ error: "Invalid stock." }, 400);
      updates.stock_quantity = input.stock_quantity;
    }
    if ("category_id" in input) {
      if (typeof input.category_id !== "string" || !uuid.test(input.category_id)) return reply({ error: "Invalid category." }, 400);
      const { data: category } = await admin.from("marketplace_categories").select("id").eq("id", input.category_id).eq("is_active", true).maybeSingle();
      if (!category) return reply({ error: "Category unavailable." }, 400);
      updates.category_id = input.category_id;
    }
    if (!Object.keys(updates).length) return reply({ error: "No changes supplied." }, 400);
    const { data, error } = await admin.from("marketplace_products").update(updates)
      .eq("id", id).eq("vendor_application_id", auth.vendor!.id).eq("status", "draft")
      .select("id,name,status").maybeSingle();
    if (error) { console.error("Product update", error); return reply({ error: "Unable to save changes. Check migration." }, 500); }
    if (!data) return reply({ error: "Product was changed; refresh and retry." }, 409);
    return reply({ success: true, product: data });
  } catch (error) { unstable_rethrow(error); console.error("Product PATCH", error); return reply({ error: "Invalid request or server error." }, 500); }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (request.headers.get("origin") !== request.nextUrl.origin) return reply({ error: "Invalid origin." }, 403);
    const { id } = await context.params;
    if (!uuid.test(id)) return reply({ error: "Invalid product ID." }, 400);
    const auth = await session();
    if (auth.error) return auth.error;
    const admin = auth.admin!;
    const { data: product } = await admin.from("marketplace_products").select("id,status")
      .eq("id", id).eq("vendor_application_id", auth.vendor!.id).maybeSingle();
    if (!product) return reply({ error: "Product not found." }, 404);
    if (product.status !== "draft") return reply({ error: "Only drafts can be deleted." }, 409);
    const { count, error: orderError } = await admin.from("marketplace_order_items")
      .select("id", { count: "exact", head: true }).eq("product_id", id);
    if (orderError) return reply({ error: "Unable to check order history." }, 500);
    if ((count ?? 0) > 0) return reply({ error: "Products with orders cannot be deleted." }, 409);
    const { data: images, error: imagesError } = await admin.from("marketplace_product_images")
      .select("id,image_url").eq("product_id", id);
    if (imagesError) return reply({ error: "Unable to check product images." }, 500);
    // Remove DB image records first, then product; storage cleanup is best effort.
    if (images?.length) {
      const { error: removeImagesError } = await admin.from("marketplace_product_images").delete().eq("product_id", id);
      if (removeImagesError) return reply({ error: "Could not remove image records." }, 500);
    }
    const { data: deleted, error } = await admin.from("marketplace_products").delete()
      .eq("id", id).eq("vendor_application_id", auth.vendor!.id).eq("status", "draft").select("id").maybeSingle();
    if (error || !deleted) return reply({ error: "Unable to delete draft product." }, 500);
    const paths = (images ?? []).map((item) => {
      try { const marker = "/storage/v1/object/public/marketplace-product-images/"; const idx = item.image_url.indexOf(marker); return idx < 0 ? null : decodeURIComponent(item.image_url.slice(idx + marker.length)); }
      catch { return null; }
    }).filter((path): path is string => !!path && path.startsWith(`${auth.vendor!.id}/${id}/`));
    if (paths.length) await admin.storage.from("marketplace-product-images").remove(paths);
    return reply({ success: true });
  } catch (error) { unstable_rethrow(error); console.error("Product DELETE", error); return reply({ error: "Server error." }, 500); }
}
