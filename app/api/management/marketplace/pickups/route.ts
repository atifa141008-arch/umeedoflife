import { unstable_rethrow } from "next/navigation";
import { connection, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeMarketplaceManagement } from "@/lib/supabase/managment-auth";

const respond = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET() {
  try {
    await connection();
    // These two permission keys must be provisioned in the management permission system.
    const access = await authorizeMarketplaceManagement("marketplace.pickups.view");
    if (!access.authorized) return respond({ error: access.message }, access.status);
    const db = createAdminClient();
    const { data: fulfillments, error } = await db.from("marketplace_vendor_fulfillments")
      .select("id,order_id,vendor_application_id,status,packed_at,ready_at,picked_up_at")
      .in("status", ["ready_for_pickup", "picked_up"])
      .order("ready_at", { ascending: false }).limit(200);
    if (error) return respond({ error: "Unable to load pickup queue. Check packing setup SQL." }, 500);
    if (!fulfillments?.length) return respond({ pickups: [] });
    const vendorIds = [...new Set(fulfillments.map(f => f.vendor_application_id))];
    const orderIds = [...new Set(fulfillments.map(f => f.order_id))];
    const ids = fulfillments.map(f => f.id);
    const [vendors, orders, assignments, items] = await Promise.all([
      db.from("vendor_applications").select("id,business_name,city").in("id", vendorIds),
      db.from("marketplace_orders").select("id,order_number,status,payment_status,payment_method").in("id", orderIds),
      db.from("marketplace_pickup_assignments").select("id,fulfillment_id,courier_name,tracking_number,booking_reference,status,assigned_at,collected_at").in("fulfillment_id", ids),
      db.from("marketplace_order_items").select("order_id,vendor_application_id,product_name,product_sku,quantity").in("order_id", orderIds).limit(2000),
    ]);
    if (vendors.error || orders.error || assignments.error || items.error) return respond({ error: "Unable to load pickup details. Run management pickup setup SQL." }, 500);
    const pickups = fulfillments.map(f => ({ ...f,
      vendor: vendors.data?.find(v => v.id === f.vendor_application_id) ?? null,
      order: orders.data?.find(o => o.id === f.order_id) ?? null,
      assignment: assignments.data?.find(a => a.fulfillment_id === f.id) ?? null,
      items: (items.data ?? []).filter(i => i.order_id === f.order_id && i.vendor_application_id === f.vendor_application_id),
    }));
    return respond({ pickups });
  } catch (error) { unstable_rethrow(error); console.error("Management pickups GET:", error); return respond({ error: "Unexpected server error." }, 500); }
}
