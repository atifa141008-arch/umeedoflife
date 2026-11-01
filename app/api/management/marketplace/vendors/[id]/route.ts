import { unstable_rethrow } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeMarketplaceManagement } from "@/lib/supabase/managment-auth";

type RouteContext = { params: Promise<{ id: string }> };
type Action = "review" | "activate" | "suspend";
type ReviewStatus = "Under Review" | "Approved" | "Rejected";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REVIEW_STATUSES: readonly string[] = ["Under Review", "Approved", "Rejected"];

function failure(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function success(message: string, application: unknown) {
  return NextResponse.json(
    { success: true, message, application },
    { headers: { "Cache-Control": "no-store" } },
  );
}

// This endpoint uses cookie authentication. Reject cross-origin browser writes.
function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    if (!sameOrigin(request)) {
      return failure("Invalid request origin.", 403);
    }

    // Authorize before accessing application data.
    const { id } = await context.params;
    if (!UUID_RE.test(id)) return failure("Invalid vendor application ID.", 400);

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return failure("Content-Type must be application/json.", 415);
    }

    let parsed: unknown;
    try {
      parsed = await request.json();
    } catch {
      return failure("Invalid JSON request body.", 400);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return failure("Invalid request body.", 400);
    }

    const body = parsed as Record<string, unknown>;
    const action = body.action;
    if (action !== "review" && action !== "activate" && action !== "suspend") {
      return failure("Invalid management action.", 400);
    }
    const typedAction: Action = action;
    const permission = typedAction === "activate"
      ? "marketplace.vendors.activate"
      : "marketplace.vendors.review";

    const authorization = await authorizeMarketplaceManagement(permission);
    if (!authorization.authorized) {
      return failure(authorization.message, authorization.status);
    }

    const admin = createAdminClient();
    const { data: application, error: fetchError } = await admin
      .from("vendor_applications")
      .select("id, status, is_active")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Vendor lookup failed:", fetchError.code);
      return failure("Unable to load the vendor application.", 500);
    }
    if (!application) return failure("Vendor application not found.", 404);

    const now = new Date().toISOString();

    if (typedAction === "review") {
      const status = body.status;
      if (typeof status !== "string" || !REVIEW_STATUSES.includes(status)) {
        return failure("Status must be Under Review, Approved, or Rejected.", 400);
      }
      const reviewStatus = status as ReviewStatus;
      if (application.is_active) {
        return failure("Deactivate the vendor before changing its review status.", 409);
      }
      if (application.status === "Suspended") {
        return failure("A suspended application cannot be reviewed through this action.", 409);
      }
      const notes = body.managementNotes;
      if (notes !== undefined && notes !== null &&
          (typeof notes !== "string" || notes.length > 5000)) {
        return failure("Management notes must be text with a maximum of 5000 characters.", 400);
      }

      const updateData: Record<string, unknown> = {
        status: reviewStatus,
        reviewed_by: authorization.employeeId,
        reviewed_at: now,
        updated_at: now,
      };
      if (notes !== undefined) {
        updateData.management_notes = typeof notes === "string" && notes.trim()
          ? notes.trim()
          : null;
      }

      const { data: updated, error } = await admin
        .from("vendor_applications")
        .update(updateData)
        .eq("id", id)
        .eq("is_active", false)
        .eq("status", application.status)
        .select("id, applicant_name, business_name, status, is_active, management_notes, reviewed_by, reviewed_at, updated_at")
        .maybeSingle();
      if (error) {
        console.error("Vendor review failed:", error.code);
        return failure("Unable to update the application.", 500);
      }
      if (!updated) return failure("Application changed. Refresh and try again.", 409);
      return success(`Application status changed to ${reviewStatus}.`, updated);
    }

    if (typedAction === "activate") {
      if (application.status !== "Approved") {
        return failure("The application must be approved before activation.", 409);
      }
      if (application.is_active) return failure("This vendor is already active.", 409);

      const { data: updated, error } = await admin
        .from("vendor_applications")
        .update({
          is_active: true,
          activated_by: authorization.employeeId,
          activated_at: now,
          updated_at: now,
        })
        .eq("id", id)
        .eq("status", "Approved")
        .eq("is_active", false)
        .select("id, applicant_name, business_name, status, is_active, activated_by, activated_at, updated_at")
        .maybeSingle();
      if (error) {
        console.error("Vendor activation failed:", error.code);
        return failure("Unable to activate this vendor.", 500);
      }
      if (!updated) return failure("Application changed. Refresh and try again.", 409);
      return success("Vendor activated successfully.", updated);
    }

    const notes = body.managementNotes;
    if (typeof notes !== "string" || !notes.trim()) {
      return failure("Provide a management note explaining the suspension.", 400);
    }
    if (notes.length > 5000) {
      return failure("Management notes cannot exceed 5000 characters.", 400);
    }
    if (application.status === "Suspended") {
      return failure("This vendor is already suspended.", 409);
    }

    const { data: updated, error } = await admin
      .from("vendor_applications")
      .update({
        status: "Suspended",
        is_active: false,
        management_notes: notes.trim(),
        reviewed_by: authorization.employeeId,
        reviewed_at: now,
        updated_at: now,
      })
      .eq("id", id)
      .eq("status", application.status)
      .eq("is_active", application.is_active)
      .select("id, applicant_name, business_name, status, is_active, management_notes, reviewed_by, reviewed_at, updated_at")
      .maybeSingle();
    if (error) {
      console.error("Vendor suspension failed:", error.code);
      return failure("Unable to suspend this vendor.", 500);
    }
    if (!updated) return failure("Application changed. Refresh and try again.", 409);
    return success("Vendor suspended successfully.", updated);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Vendor management API error:", error);
    return failure("An unexpected server error occurred.", 500);
  }
}
