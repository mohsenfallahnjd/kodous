import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  session.destroy();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/login";
  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
