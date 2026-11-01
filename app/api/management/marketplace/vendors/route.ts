import { unstable_rethrow } from "next/navigation";
import { connection, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authorizeMarketplaceManagement } from "@/lib/supabase/managment-auth";

export async function GET() {
  try {
    // Authorization reads request cookies, so opt into request-time execution.
    await connection();

    const authorization = await authorizeMarketplaceManagement(
      "marketplace.vendors.view",
    );

    if (!authorization.authorized) {
      return NextResponse.json(
        { error: authorization.message },
        {
          status: authorization.status,
          headers: { "Cache-Control": "private, no-store" },
        },
      );
    }

    // The admin client is only created after authorization succeeds.
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("vendor_applications")
      .select(`
        id, user_id, applicant_name, business_name, email, phone, city,
        business_type, business_description, website, status, is_active,
        management_notes, reviewed_by, reviewed_at, activated_by,
        activated_at, created_at, updated_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Vendor applications query failed:", error.code);
      return NextResponse.json(
        { error: "Unable to load vendor applications." },
        { status: 500, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    return NextResponse.json(
      { applications: data ?? [] },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    // Let Next.js handle prerender cancellation instead of logging it as an API failure.
    unstable_rethrow(error);
    console.error("Vendor management API error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
