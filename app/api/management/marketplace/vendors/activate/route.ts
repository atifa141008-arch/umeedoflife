import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeMarketplaceManagement } from "@/lib/supabase/managment-auth";

export async function POST(request: Request) {
  try {
    const authorization = await authorizeMarketplaceManagement(
      "marketplace.vendors.activate"
    );

    if (!authorization.authorized) {
      return NextResponse.json(
        { error: authorization.message },
        { status: authorization.status }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;
    const vendorId = input.vendorId;
    const active = input.active;

    if (
      typeof vendorId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        vendorId
      )
    ) {
      return NextResponse.json(
        { error: "A valid vendor ID is required." },
        { status: 400 }
      );
    }

    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: "Active must be true or false." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: vendor, error: lookupError } = await admin
      .from("vendor_applications")
      .select("id, status, is_active")
      .eq("id", vendorId)
      .maybeSingle();

    if (lookupError) {
      console.error("Vendor activation lookup failed:", lookupError);

      return NextResponse.json(
        { error: "Unable to load vendor application." },
        { status: 500 }
      );
    }

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor application not found." },
        { status: 404 }
      );
    }

    if (vendor.status?.toLowerCase() !== "approved") {
      return NextResponse.json(
        { error: "Only approved vendors can be activated." },
        { status: 409 }
      );
    }

    if (vendor.is_active === active) {
      return NextResponse.json({
        success: true,
        message: active
          ? "Vendor is already active."
          : "Vendor is already inactive.",
        application: vendor,
      });
    }

    const now = new Date().toISOString();

    const update: Record<string, unknown> = {
      is_active: active,
      updated_at: now,
    };

    if (active) {
      update.activated_by = authorization.employeeId;
      update.activated_at = now;
    } else {
      // Preserve the original activation audit fields.
      // The latest deactivation event should be recorded separately
      // when a dedicated vendor activity log is implemented.
    }

    const { data: updatedVendor, error: updateError } = await admin
      .from("vendor_applications")
      .update(update)
      .eq("id", vendorId)
      .eq("status", vendor.status)
      .eq("is_active", vendor.is_active)
      .select(
        "id, status, is_active, activated_by, activated_at, updated_at"
      )
      .maybeSingle();

    if (updateError) {
      console.error("Vendor activation update failed:", updateError);

      return NextResponse.json(
        { error: "Unable to update vendor activation." },
        { status: 500 }
      );
    }

    if (!updatedVendor) {
      return NextResponse.json(
        {
          error:
            "Vendor status changed during this request. Refresh and try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: active
        ? "Vendor activated successfully."
        : "Vendor deactivated successfully.",
      application: updatedVendor,
    });
  } catch (error) {
    console.error("Vendor activation API error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}