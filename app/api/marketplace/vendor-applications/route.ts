import { NextResponse } from "next/server";

// Backend TODO: require authentication, validate application fields, rate-limit and persist securely.
export async function GET() { return NextResponse.json({ error: "Vendor application API is not implemented yet.", applications: [] }, { status: 501 }); }
export async function POST() { return NextResponse.json({ error: "Vendor application API is not implemented yet. No application was saved." }, { status: 501 }); }
