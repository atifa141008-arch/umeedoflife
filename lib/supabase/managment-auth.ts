import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type MarketplacePermission =
  | "marketplace.vendors.view"
  | "marketplace.vendors.review"
  | "marketplace.vendors.activate"
  | "marketplace.pickups.view"
  | "marketplace.pickups.manage";

export async function authorizeMarketplaceManagement(
  requiredPermission: MarketplacePermission
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      authorized: false as const,
      status: 401 as const,
      message: "Please sign in to continue.",
    };
  }

  const admin = createAdminClient();

  const { data: employee, error: employeeError } = await admin
    .from("employee_profiles")
    .select("id, status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    employeeError ||
    !employee ||
    employee.status?.toLowerCase() !== "active"
  ) {
    return {
      authorized: false as const,
      status: 403 as const,
      message: "Active management access is required.",
    };
  }

  const { data: assignments, error: roleError } = await admin
    .from("employee_roles")
    .select("role_id, expires_at")
    .eq("employee_id", employee.id);

  if (roleError || !assignments) {
    console.error("Management role lookup failed:", roleError);

    return {
      authorized: false as const,
      status: 403 as const,
      message: "Unable to verify management permissions.",
    };
  }

  const now = Date.now();

  const validRoleIds = assignments
    .filter(
      (assignment) =>
        !assignment.expires_at ||
        new Date(assignment.expires_at).getTime() > now
    )
    .map((assignment) => assignment.role_id);

  if (validRoleIds.length === 0) {
    return {
      authorized: false as const,
      status: 403 as const,
      message: "No valid management role was found.",
    };
  }

  const { data: rolePermissions, error: permissionError } = await admin
    .from("role_permissions")
    .select(`
      role_id,
      permissions!inner (
        permission_key
      )
    `)
    .in("role_id", validRoleIds);

  if (permissionError || !rolePermissions) {
    console.error("Permission lookup failed:", permissionError);

    return {
      authorized: false as const,
      status: 403 as const,
      message: "Unable to verify management permissions.",
    };
  }

  const hasPermission = rolePermissions.some((item: any) => {
    const permissions = Array.isArray(item.permissions)
      ? item.permissions
      : [item.permissions];

    return (
      validRoleIds.includes(item.role_id) &&
      permissions.some(
        (permission: any) =>
          permission?.permission_key === requiredPermission
      )
    );
  });

  if (!hasPermission) {
    return {
      authorized: false as const,
      status: 403 as const,
      message: "You do not have permission to perform this action.",
    };
  }

  return {
    authorized: true as const,
    userId: user.id,
    employeeId: employee.id,
  };
}