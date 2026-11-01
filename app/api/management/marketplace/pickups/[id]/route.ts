import { unstable_rethrow } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeMarketplaceManagement } from "@/lib/supabase/managment-auth";

const respond = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) return respond({ error: "Invalid origin." }, 403);
    const access = await authorizeMarketplaceManagement("marketplace.pickups.manage");
    if (!access.authorized) return respond({ error: access.message }, access.status);
    const { id } = await context.params;
    if (!uuid.test(id)) return respond({ error: "Invalid pickup ID." }, 400);
    const raw: unknown = await request.json().catch(() => null);
    if (!raw || typeof raw !== "object") return respond({ error: "Invalid request body." }, 400);
    const body = raw as Record<string, unknown>;
    const db = createAdminClient();
    const { data: fulfillment, error: lookupError } = await db.from("marketplace_vendor_fulfillments")
      .select("id,order_id,vendor_application_id,status").eq("id", id).maybeSingle();
    if (lookupError) return respond({ error: "Pickup lookup failed." }, 500);
    if (!fulfillment) return respond({ error: "Pickup not found." }, 404);
    if (body.action === "assign") {
      if (fulfillment.status !== "ready_for_pickup") return respond({ error: "Seller has not marked this parcel ready for pickup." }, 409);
      const courier = typeof body.courier_name === "string" ? body.courier_name.trim() : "";
      const tracking = typeof body.tracking_number === "string" ? body.tracking_number.trim() : "";
      const reference = typeof body.booking_reference === "string" ? body.booking_reference.trim() : "";
      if (courier.length < 2 || courier.length > 100 || tracking.length < 2 || tracking.length > 120 || reference.length > 120) return respond({ error: "Enter valid courier and tracking details." }, 400);
      const { data: order, error: orderError } = await db.from("marketplace_orders").select("status,payment_method,payment_status").eq("id", fulfillment.order_id).maybeSingle();
      if (orderError || !order) return respond({ error: "Order lookup failed." }, 500);
      if (!["confirmed", "processing"].includes(order.status) || (order.payment_method !== "cod" && order.payment_status !== "paid")) return respond({ error: "Order is not eligible for courier assignment." }, 409);
      // Insert only: a second assignment is rejected by the unique constraint.
      const { error } = await db.from("marketplace_pickup_assignments").insert({ fulfillment_id: id, courier_name: courier, tracking_number: tracking, booking_reference: reference || null, assigned_by: access.employeeId });
      if (error) return respond({ error: error.code === "23505" ? "Courier already assigned. Refresh." : "Unable to assign courier." }, error.code === "23505" ? 409 : 500);
      return respond({ success: true, message: "Courier details recorded. Book the rider separately with your courier provider." });
    }
    if (body.action === "collect") {
      if (fulfillment.status !== "ready_for_pickup") return respond({ error: "Pickup status has changed." }, 409);
      const { data: assignment, error: assignmentError } = await db.from("marketplace_pickup_assignments").select("id,status").eq("fulfillment_id", id).maybeSingle();
      if (assignmentError || !assignment || assignment.status !== "assigned") return respond({ error: "Assign a courier before confirming collection." }, 409);
      const { data, error } = await db.rpc("management_confirm_marketplace_pickup", { p_fulfillment_id: id, p_employee_id: access.employeeId });
      if (error) return respond({ error: "Could not confirm courier collection." }, 500);
      if (!data) return respond({ error: "Pickup already changed. Refresh." }, 409);
      return respond({ success: true, message: "Courier collection confirmed." });
    }
    return respond({ error: "Unknown action." }, 400);
  } catch (error) { unstable_rethrow(error); console.error("Management pickup POST:", error); return respond({ error: "Unexpected server error." }, 500); }
}
