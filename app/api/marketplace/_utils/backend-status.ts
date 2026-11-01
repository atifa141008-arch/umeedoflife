import { NextResponse } from "next/server";
export function backendNotConfigured(feature: string) {
 return NextResponse.json({ ok: false, code: "MARKETPLACE_BACKEND_PENDING", feature, message: "This endpoint contract is present, but Supabase integration is scheduled for the next phase. No data was changed." }, { status: 503 });
}
export function methodNotAllowed(allowed: string[]) {
 return NextResponse.json({ ok: false, code: "METHOD_NOT_ALLOWED", allowed }, { status: 405, headers: { Allow: allowed.join(", ") } });
}
