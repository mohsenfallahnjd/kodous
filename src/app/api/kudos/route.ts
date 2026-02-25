import { NextRequest, NextResponse } from "next/server";
import { createKodu, getKoduByTo, getAllKodus } from "@/lib/kudos";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");

  if (to) {
    const kodus = getKoduByTo(to);
    return NextResponse.json({ kodus });
  }

  const kodus = getAllKodus();
  return NextResponse.json({ kodus });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, message } = body;

    if (!from || !to || !message) {
      return NextResponse.json(
        { error: "from, to, and message are required" },
        { status: 400 }
      );
    }

    const kodu = createKodu(from, to, message);
    return NextResponse.json({ kodu });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
