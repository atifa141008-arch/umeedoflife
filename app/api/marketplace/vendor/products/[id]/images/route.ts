import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!uuid.test(id)) return reply({ error: "Invalid product." }, 400);
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email_confirmed_at) return reply({ error: "Verified vendor login required." }, 401);
    const admin = createAdminClient();
    const { data: vendor, error: vendorError } = await admin.from("vendor_applications")
      .select("id").eq("user_id", user.id).eq("status", "Approved").eq("is_active", true).maybeSingle();
    if (vendorError) return reply({ error: "Store verification failed." }, 500);
    if (!vendor) return reply({ error: "Approved active vendor store required." }, 403);
    const { data: product, error: productError } = await admin.from("marketplace_products")
      .select("id").eq("id", id).eq("vendor_application_id", vendor.id).maybeSingle();
    if (productError) return reply({ error: "Unable to verify product." }, 500);
    if (!product) return reply({ error: "Product not found in your store." }, 404);
    const { data: images, error: imageError } = await admin.from("marketplace_product_images")
      .select("id, image_url, is_primary, sort_order").eq("product_id", id).order("sort_order", { ascending: true });
    if (imageError) return reply({ error: "Unable to load images." }, 500);
    return reply({ images: images ?? [] });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Product image list failed:", error);
    return reply({ error: "Unexpected server error." }, 500);
  }
}
