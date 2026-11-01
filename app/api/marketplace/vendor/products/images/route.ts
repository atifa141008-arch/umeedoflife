import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const bucket = "marketplace-product-images";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "private, no-store" };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== request.nextUrl.origin) return reply({ error: "Invalid request origin." }, 403);
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.email_confirmed_at) return reply({ error: "Verified vendor login required." }, 401);
    const admin = createAdminClient();
    const { data: vendor, error: vendorError } = await admin.from("vendor_applications")
      .select("id").eq("user_id", user.id).eq("status", "Approved").eq("is_active", true).maybeSingle();
    if (vendorError) return reply({ error: "Store verification failed." }, 500);
    if (!vendor) return reply({ error: "Approved active vendor store required." }, 403);

    const form = await request.formData();
    const productId = form.get("product_id");
    const file = form.get("image");
    if (typeof productId !== "string" || !uuid.test(productId)) return reply({ error: "Invalid product." }, 400);
    if (!(file instanceof File)) return reply({ error: "Choose an image." }, 400);
    if (file.size === 0 || file.size > 5 * 1024 * 1024) return reply({ error: "Image must be under 5 MB." }, 400);
    const mimeToExtension: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const ext = mimeToExtension[file.type];
    if (!ext) return reply({ error: "Only JPG, PNG and WebP images are allowed." }, 400);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const jpg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const png = bytes.length > 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v);
    const webp = bytes.length > 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    if (!(ext === "jpg" && jpg || ext === "png" && png || ext === "webp" && webp)) return reply({ error: "Invalid image content." }, 400);

    const { data: product, error: productError } = await admin.from("marketplace_products")
      .select("id, status").eq("id", productId).eq("vendor_application_id", vendor.id).maybeSingle();
    if (productError) return reply({ error: "Unable to verify product." }, 500);
    if (!product) return reply({ error: "Product not found in your store." }, 404);
    if (product.status !== "draft") return reply({ error: "Images can only be added to draft products." }, 409);

    const { count, error: countError } = await admin.from("marketplace_product_images")
      .select("id", { count: "exact", head: true }).eq("product_id", productId);
    if (countError) return reply({ error: "Unable to check product images." }, 500);
    if ((count ?? 0) >= 5) return reply({ error: "Maximum 5 images per product." }, 400);

    const path = `${vendor.id}/${productId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await admin.storage.from(bucket).upload(path, bytes, { contentType: file.type, upsert: false, cacheControl: "3600" });
    if (uploadError) {
      console.error("Product image storage error:", uploadError);
      return reply({ error: "Image upload failed. Confirm Storage bucket is created." }, 500);
    }
    const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(path);
    const { data: image, error: insertError } = await admin.from("marketplace_product_images")
      .insert({ product_id: productId, image_url: publicUrl.publicUrl, is_primary: (count ?? 0) === 0, sort_order: count ?? 0 })
      .select("id, image_url, is_primary, sort_order").single();
    if (insertError) {
      await admin.storage.from(bucket).remove([path]);
      console.error("Product image DB error:", insertError);
      return reply({ error: "Image record could not be saved." }, 500);
    }
    return reply({ success: true, image }, 201);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Vendor image upload failed:", error);
    return reply({ error: "Unexpected image upload error." }, 500);
  }
}
