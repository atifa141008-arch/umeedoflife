import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_ROLES = ["CEO", "CO_CEO", "CENTRAL_ADMIN"] as const;
const ASSIGNABLE_ROLES = ["EMPLOYEE", "DEPARTMENT_HEAD"] as const;

export async function POST(request: Request) {
  let createdUserId: string | null = null;
  let admin: ReturnType<typeof createAdminClient> | null = null;

  try {
    // 1. Verify the current session
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    // 2. Verify the current employee profile
    const { data: profile, error: profileError } = await supabase
      .from("employee_profiles")
      .select("id, status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile || profile.status !== "active") {
      return NextResponse.json(
        { error: "Your account is not authorized." },
        { status: 403 }
      );
    }

    // 3. Verify central leadership role
    const { data: assignments, error: assignmentError } = await supabase
      .from("employee_roles")
      .select("roles!inner(name), departments!inner(slug)")
      .eq("employee_id", user.id)
      .eq("departments.slug", "central");

    const authorized =
      !assignmentError &&
      (assignments ?? []).some((item: any) =>
        ALLOWED_ROLES.includes(item.roles?.name)
      );

    if (!authorized) {
      return NextResponse.json(
        { error: "Central leadership access is required." },
        { status: 403 }
      );
    }

    // 4. Parse and validate request body
    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const fullName =
      typeof body.full_name === "string" ? body.full_name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const employeeCode =
      typeof body.employee_code === "string"
        ? body.employee_code.trim()
        : "";

    const jobTitle =
      typeof body.job_title === "string" ? body.job_title.trim() : "";

    const departmentSlug =
      typeof body.department === "string" ? body.department.trim() : "";

    const roleName =
      typeof body.role === "string"
        ? body.role.trim().toUpperCase()
        : "";

    if (
      !fullName ||
      !email ||
      !employeeCode ||
      !jobTitle ||
      !departmentSlug ||
      !ASSIGNABLE_ROLES.includes(roleName as (typeof ASSIGNABLE_ROLES)[number])
    ) {
      return NextResponse.json(
        { error: "Please complete all fields correctly." },
        { status: 400 }
      );
    }

    if (
      fullName.length > 120 ||
      email.length > 254 ||
      employeeCode.length > 50 ||
      jobTitle.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "One or more fields have an invalid format." },
        { status: 400 }
      );
    }

    // 5. Create server-only admin client
    admin = createAdminClient();

    // 6. Verify department
    const { data: department, error: departmentError } = await admin
      .from("departments")
      .select("id, status")
      .eq("slug", departmentSlug)
      .maybeSingle();

    if (departmentError) {
      console.error("Department lookup error:", departmentError);

      return NextResponse.json(
        { error: "Could not verify the selected department." },
        { status: 500 }
      );
    }

    if (!department || department.status !== "active") {
      return NextResponse.json(
        { error: "This department is not available for assignments." },
        { status: 400 }
      );
    }

    // 7. Find the exact role
    const { data: role, error: roleError } = await admin
      .from("roles")
      .select("id, name")
      .eq("name", roleName)
      .maybeSingle();

    if (roleError) {
      console.error("Role lookup error:", roleError);

      return NextResponse.json(
        { error: "Could not verify the selected role." },
        { status: 500 }
      );
    }

    if (!role || !ASSIGNABLE_ROLES.includes(role.name as (typeof ASSIGNABLE_ROLES)[number])) {
      console.error("Role lookup failed:", {
        requestedRole: roleName,
        foundRole: role?.name ?? null,
      });

      return NextResponse.json(
        {
          error: "Selected role was not found or cannot be assigned.",
          requestedRole: roleName,
          foundRole: role?.name ?? null,
        },
        { status: 400 }
      );
    }

    // 8. Check employee code duplication
    const { data: existingProfile, error: existingProfileError } =
      await admin
        .from("employee_profiles")
        .select("id")
        .eq("employee_code", employeeCode)
        .maybeSingle();

    if (existingProfileError) {
      console.error("Employee lookup error:", existingProfileError);

      return NextResponse.json(
        { error: "Could not verify the employee code." },
        { status: 500 }
      );
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: "This employee code is already in use." },
        { status: 409 }
      );
    }

    // 9. Send invitation with callback URL
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("next", "/auth/accept-invite");

    const { data: invitation, error: invitationError } =
      await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName },
        redirectTo: callbackUrl.toString(),
      });

    if (invitationError || !invitation.user) {
      console.error("Employee invitation error:", invitationError);

      return NextResponse.json(
        {
          error:
            invitationError?.message ??
            "Could not send the employee invitation.",
        },
        { status: 400 }
      );
    }

    createdUserId = invitation.user.id;

    // 10. Create employee profile
    const { error: insertProfileError } = await admin
      .from("employee_profiles")
      .insert({
        id: createdUserId,
        full_name: fullName,
        employee_code: employeeCode,
        job_title: jobTitle,
        status: "active",
      });

    if (insertProfileError) {
      console.error("Employee profile insert error:", insertProfileError);

      const { error: rollbackError } =
        await admin.auth.admin.deleteUser(createdUserId);

      if (rollbackError) {
        console.error("Invitation rollback error:", rollbackError);
      }

      return NextResponse.json(
        { error: "Employee profile creation failed." },
        { status: 500 }
      );
    }

    // 11. Assign role and department
    const { error: roleInsertError } = await admin
      .from("employee_roles")
      .insert({
        employee_id: createdUserId,
        role_id: role.id,
        department_id: department.id,
        granted_by: user.id,
      });

    if (roleInsertError) {
      console.error("Employee role insert error:", roleInsertError);

      const { error: profileRollbackError } = await admin
        .from("employee_profiles")
        .delete()
        .eq("id", createdUserId);

      if (profileRollbackError) {
        console.error("Profile rollback error:", profileRollbackError);
      }

      const { error: userRollbackError } =
        await admin.auth.admin.deleteUser(createdUserId);

      if (userRollbackError) {
        console.error("User rollback error:", userRollbackError);
      }

      return NextResponse.json(
        { error: "Role assignment failed. Check server logs." },
        { status: 500 }
      );
    }

    // 12. Success
    return NextResponse.json(
      {
        success: true,
        message: `Invitation sent to ${email}.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create employee error:", error);

    // Attempt cleanup if an unexpected error occurs after invitation.
    if (createdUserId && admin) {
      const { error: cleanupError } =
        await admin.auth.admin.deleteUser(createdUserId);

      if (cleanupError) {
        console.error("Unexpected-error cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );  }
}