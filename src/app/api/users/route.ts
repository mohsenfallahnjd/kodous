import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AVATARS } from "@/components/Avatar";
import { createUser, deleteUser, getUsers, updateUser } from "@/lib/users";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = await getUsers();
    return NextResponse.json({ users });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    const status = err instanceof Error && err.message === "Forbidden" ? 403 : 401;
    const error = status === 403 ? "Forbidden" : "Unauthorized";
    return NextResponse.json({ error }, { status });
  }
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const avatar = AVATARS.includes(body.avatar)
      ? body.avatar
      : "boy1";

    const user = await createUser(name, avatar);
    return NextResponse.json({ user });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    const status = err instanceof Error && err.message === "Forbidden" ? 403 : 401;
    const error = status === 403 ? "Forbidden" : "Unauthorized";
    return NextResponse.json({ error }, { status });
  }
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const avatar = AVATARS.includes(body.avatar)
      ? body.avatar
      : "boy1";

    const user = await updateUser(id, name, avatar);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    const status = err instanceof Error && err.message === "Forbidden" ? 403 : 401;
    const error = status === 403 ? "Forbidden" : "Unauthorized";
    return NextResponse.json({ error }, { status });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const ok = await deleteUser(id);
    if (!ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
