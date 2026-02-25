import { getDb, initDb } from "./db";

export type Kodu = {
  id: string;
  from: string;
  to: string;
  message: string;
  anonymous: boolean;
  createdAt: string;
};

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function createKodu(
  to: string,
  message: string,
  anonymous = true
): Promise<Kodu> {
  await ensureInit();
  const sql = getDb();
  const id = crypto.randomUUID();
  const [row] = await sql`
    INSERT INTO kodous (id, "from", "to", message, anonymous)
    VALUES (${id}, ${anonymous ? "Anonymous" : "Unknown"}, ${to.trim()}, ${message.trim()}, ${anonymous})
    RETURNING id, "from", "to", message, anonymous, created_at
  `;
  return {
    id: row.id,
    from: row.from || "Anonymous",
    to: row.to,
    message: row.message,
    anonymous: row.anonymous ?? true,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getKodu(id: string): Promise<Kodu | null> {
  await ensureInit();
  const sql = getDb();
  const [row] = await sql`
    SELECT id, "from", "to", message, anonymous, created_at
    FROM kodous WHERE id = ${id}
  `;
  if (!row) return null;
  return {
    id: row.id,
    from: row.anonymous ? "Someone" : row.from,
    to: row.to,
    message: row.message,
    anonymous: row.anonymous ?? true,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getKoduByTo(to: string): Promise<Kodu[]> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`
    SELECT id, "from", "to", message, anonymous, created_at
    FROM kodous
    WHERE LOWER("to") = LOWER(${to})
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    from: row.anonymous ? "Someone" : row.from,
    to: row.to,
    message: row.message,
    anonymous: row.anonymous ?? true,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

export async function getAllKodus(): Promise<Kodu[]> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`
    SELECT id, "from", "to", message, anonymous, created_at
    FROM kodous
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    from: row.anonymous ? "Someone" : row.from,
    to: row.to,
    message: row.message,
    anonymous: row.anonymous ?? true,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

export type LeaderboardEntry = {
  name: string;
  count: number;
  rank: number;
};

export async function getWeeklyLeaderboard(
  week: "current" | "last"
): Promise<LeaderboardEntry[]> {
  await ensureInit();
  const sql = getDb();
  const isCurrent = week === "current";
  const rows = isCurrent
    ? await sql`
        SELECT "to" as name, COUNT(*)::int as count
        FROM kodous
        WHERE created_at >= date_trunc('week', NOW())
        GROUP BY "to"
        ORDER BY count DESC
      `
    : await sql`
        SELECT "to" as name, COUNT(*)::int as count
        FROM kodous
        WHERE created_at >= date_trunc('week', NOW()) - interval '7 days'
          AND created_at < date_trunc('week', NOW())
        GROUP BY "to"
        ORDER BY count DESC
      `;
  return rows.map((r, i) => ({
    name: r.name,
    count: r.count,
    rank: i + 1,
  }));
}
