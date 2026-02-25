import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, validateCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const auth = validateCredentials(username, password);
    if (!auth.ok || !auth.role) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.loggedIn = true;
    session.username = auth.username;
    session.role = auth.role;
    await session.save();

    return NextResponse.json({ ok: true, role: auth.role });
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
