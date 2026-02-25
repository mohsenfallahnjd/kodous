import { NextRequest, NextResponse } from "next/server";
import { getWeeklyLeaderboard } from "@/lib/kudos";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const week = searchParams.get("week") === "last" ? "last" : "current";
    const leaderboard = await getWeeklyLeaderboard(week);
    return NextResponse.json({ leaderboard, week });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
