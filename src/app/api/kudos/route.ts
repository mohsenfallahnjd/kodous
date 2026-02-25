import { NextRequest, NextResponse } from "next/server";
import { createKodu, getKoduByTo, getAllKodus } from "@/lib/kudos";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to");

    if (to) {
      const kodus = await getKoduByTo(to);
      return NextResponse.json({ kodus });
    }

    const kodus = await getAllKodus();
    return NextResponse.json({ kodus });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "to and message are required" },
        { status: 400 }
      );
    }

    const kodu = await createKodu(to, message, true);
    return NextResponse.json({ kodu });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
