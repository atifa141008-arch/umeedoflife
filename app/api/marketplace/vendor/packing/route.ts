import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const reply = (data: object, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });

async function seller() {
  const auth = await createClient();
  const { data: { user }, error } = await auth.auth.getUser();
  if (error || !user?.email_confirmed_at) return { error: "Verified seller login required.", code: 401 } as const;
  const admin = createAdminClient();
  const { data: vendor, error: vendorError } = await admin.from("vendor_applications").select("id,business_name").eq("user_id", user.id).eq("status", "Approved").eq("is_active", true).maybeSingle();
  if (vendorError) return { error: "Seller verification failed.", code: 500 } as const;
  if (!vendor) return { error: "Active seller account required.", code: 403 } as const;
  return { admin, vendor };
}

async function ownItems(admin: ReturnType<typeof createAdminClient>, vendorId: string, orderId?: string) {
  let query = admin.from("marketplace_order_items").select("id,order_id,product_name,product_sku,product_image_url,variant_name,quantity,unit_price,line_total").eq("vendor_application_id", vendorId).limit(1000);
  if (orderId) query = query.eq("order_id", orderId);
  return query;
}

export async function GET() {
  try {
    const ctx = await seller();
    if ("error" in ctx) return reply({ error: ctx.error }, ctx.code);
    const { admin, vendor } = ctx;
    const { data: items, error: itemError } = await ownItems(admin, vendor.id);
    if (itemError) return reply({ error: "Unable to load seller order items." }, 500);
    const ids = [...new Set((items || []).map(i => i.order_id))];
    if (!ids.length) return reply({ orders: [], store: vendor.business_name });
    const [{ data: orders, error: orderError }, { data: fulfillments, error: fulfillError }] = await Promise.all([
      admin.from("marketplace_orders").select("id,order_number,status,payment_method,payment_status,tracking_number,created_at,placed_at").in("id", ids).order("created_at", { ascending: false }),
      admin.from("marketplace_vendor_fulfillments").select("order_id,status,packed_at,ready_at,picked_up_at").eq("vendor_application_id", vendor.id).in("order_id", ids),
    ]);
    if (orderError || fulfillError) return reply({ error: "Could not load packing records. Run packing setup SQL first." }, 500);
    return reply({ store: vendor.business_name, orders: (orders || []).map(order => ({
      ...order, items: (items || []).filter(item => item.order_id === order.id),
      fulfillment: (fulfillments || []).find(f => f.order_id === order.id) || { status: "new" },
    })) });
  } catch (error) { unstable_rethrow(error); console.error("Packing GET", error); return reply({ error: "Unexpected server error." }, 500); }
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) return reply({ error: "Invalid request origin." }, 403);
    const ctx = await seller();
    if ("error" in ctx) return reply({ error: ctx.error }, ctx.code);
    const { admin, vendor } = ctx;
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return reply({ error: "Invalid request." }, 400);
    const { orderId, action } = body as Record<string, unknown>;
    if (typeof orderId !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(orderId) || !["pack", "ready"].includes(String(action))) return reply({ error: "Invalid order or action." }, 400);
    const { data: items, error: itemError } = await ownItems(admin, vendor.id, orderId);
    if (itemError) return reply({ error: "Unable to verify seller items." }, 500);
    if (!items?.length) return reply({ error: "Order not found for your store." }, 404);
    const { data: order, error: orderError } = await admin.from("marketplace_orders").select("id,status,payment_method,payment_status").eq("id", orderId).maybeSingle();
    if (orderError || !order) return reply({ error: "Order not found." }, 404);
    if (!["confirmed", "processing"].includes(order.status)) return reply({ error: "This order is not currently eligible for packing." }, 409);
    if (order.payment_method !== "cod" && order.payment_status !== "paid") return reply({ error: "Payment has not been confirmed for packing." }, 409);
    const now = new Date().toISOString();
    if (action === "pack") {
      // Initialize once; concurrent requests are protected by the unique constraint.
      const { error: createError } = await admin.from("marketplace_vendor_fulfillments").upsert({ order_id: orderId, vendor_application_id: vendor.id, status: "new" }, { onConflict: "order_id,vendor_application_id", ignoreDuplicates: true });
      if (createError) return reply({ error: "Unable to initialize packing record." }, 500);
      const { data, error } = await admin.from("marketplace_vendor_fulfillments").update({ status: "packed", packed_at: now, updated_at: now }).eq("order_id", orderId).eq("vendor_application_id", vendor.id).eq("status", "new").select("status").maybeSingle();
      if (error) return reply({ error: "Unable to update packing status." }, 500);
      if (!data) return reply({ error: "Packing status already changed. Refresh the page." }, 409);
      return reply({ status: "packed" });
    }
    const { data, error } = await admin.from("marketplace_vendor_fulfillments").update({ status: "ready_for_pickup", ready_at: now, updated_at: now }).eq("order_id", orderId).eq("vendor_application_id", vendor.id).eq("status", "packed").select("status").maybeSingle();
    if (error) return reply({ error: "Unable to mark ready for pickup." }, 500);
    if (!data) return reply({ error: "Order must be packed first, or status has already changed." }, 409);
    return reply({ status: "ready_for_pickup" });
  } catch (error) { unstable_rethrow(error); console.error("Packing POST", error); return reply({ error: "Unexpected server error." }, 500); }
}
