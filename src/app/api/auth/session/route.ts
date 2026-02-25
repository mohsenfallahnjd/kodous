import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  const role = session.role ?? (session.loggedIn ? "admin" : undefined);
  return NextResponse.json({
    loggedIn: !!session.loggedIn,
    username: session.username ?? null,
    role: role ?? null,
    isAdmin: role === "admin",
  });
}
