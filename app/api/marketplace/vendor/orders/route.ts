import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const json = (value: object, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET() {
  try {
    const auth = await createClient();
    const { data: { user }, error: authError } = await auth.auth.getUser();
    if (authError || !user?.email_confirmed_at) return json({ error: "Verified seller login required." }, 401);
    const admin = createAdminClient();
    const { data: vendor, error: vendorError } = await admin.from("vendor_applications")
      .select("id, business_name").eq("user_id", user.id).eq("status", "Approved").eq("is_active", true).maybeSingle();
    if (vendorError) return json({ error: "Could not verify seller." }, 500);
    if (!vendor) return json({ error: "Active seller account required." }, 403);

    const { data: items, error: itemsError } = await admin.from("marketplace_order_items")
      .select("id,order_id,product_id,product_name,product_sku,product_image_url,variant_name,quantity,unit_price,line_total")
      .eq("vendor_application_id", vendor.id).order("id", { ascending: false }).limit(1000);
    if (itemsError) { console.error("Seller orders items:", itemsError); return json({ error: "Could not load seller order items." }, 500); }
    const orderIds = [...new Set((items || []).map((item) => item.order_id).filter(Boolean))];
    if (!orderIds.length) return json({ store: vendor.business_name, orders: [] });
    const { data: orders, error: ordersError } = await admin.from("marketplace_orders")
      .select("id,order_number,status,payment_method,payment_status,tracking_number,placed_at,created_at,updated_at")
      .in("id", orderIds).order("created_at", { ascending: false });
    if (ordersError) { console.error("Seller orders:", ordersError); return json({ error: "Could not load orders." }, 500); }
    return json({ store: vendor.business_name, orders: (orders || []).map((order) => ({
      ...order, items: (items || []).filter((item) => item.order_id === order.id),
    })) });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Seller orders GET:", error);
    return json({ error: "Unexpected server error." }, 500);
  }
}
