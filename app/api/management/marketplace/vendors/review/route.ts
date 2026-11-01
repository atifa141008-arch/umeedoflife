import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeMarketplaceManagement } from "@/lib/supabase/managment-auth";

type ReviewAction = "approve" | "reject";

export async function POST(request: Request) {
  try {
    const authorization = await authorizeMarketplaceManagement(
      "marketplace.vendors.review"
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
    const action = input.action;
    const notes = input.notes;

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

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Action must be approve or reject." },
        { status: 400 }
      );
    }

    if (
      notes !== undefined &&
      notes !== null &&
      (typeof notes !== "string" || notes.length > 2000)
    ) {
      return NextResponse.json(
        { error: "Notes must be text up to 2000 characters." },
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
      console.error("Vendor review lookup failed:", lookupError);

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

    const currentStatus = vendor.status?.toLowerCase();

    if (currentStatus !== "pending") {
      return NextResponse.json(
        {
          error: "Only pending applications can be reviewed.",
          currentStatus: vendor.status,
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const update = {
      status: action === "approve" ? "Approved" : "Rejected",
      is_active: false,
      management_notes:
        typeof notes === "string" ? notes.trim() || null : null,
      reviewed_by: authorization.employeeId,
      reviewed_at: now,
      updated_at: now,
    };

    const { data: updatedVendor, error: updateError } = await admin
      .from("vendor_applications")
      .update(update)
      .eq("id", vendorId)
      .eq("status", vendor.status)
      .select("id, status, is_active, reviewed_by, reviewed_at, management_notes")
      .maybeSingle();

    if (updateError) {
      console.error("Vendor review update failed:", updateError);

      return NextResponse.json(
        { error: "Unable to update vendor application." },
        { status: 500 }
      );
    }

    if (!updatedVendor) {
      return NextResponse.json(
        { error: "This application has already been changed. Refresh and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Vendor application approved. Activate the vendor separately before they can sell."
          : "Vendor application rejected.",
      application: updatedVendor,
    });
  } catch (error) {
    console.error("Vendor review API error:", error);

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}