import { getDb, initDb } from "./db";
import type { AvatarId } from "@/components/Avatar";

export type User = {
  id: string;
  name: string;
  avatar: AvatarId;
};

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function getUsers(): Promise<User[]> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`SELECT id, name, avatar FROM users ORDER BY name`;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    avatar: (r.avatar || "boy1") as AvatarId,
  }));
}

export async function createUser(
  name: string,
  avatar: AvatarId = "boy1"
): Promise<User> {
  await ensureInit();
  const sql = getDb();
  const [row] = await sql`
    INSERT INTO users (name, avatar) VALUES (${name.trim()}, ${avatar})
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar
    RETURNING id, name, avatar
  `;
  return {
    id: row.id,
    name: row.name,
    avatar: (row.avatar || "boy1") as AvatarId,
  };
}

export async function updateUser(
  id: string,
  name: string,
  avatar: AvatarId = "boy1"
): Promise<User | null> {
  await ensureInit();
  const sql = getDb();
  const [row] = await sql`
    UPDATE users
    SET name = ${name.trim()}, avatar = ${avatar}
    WHERE id = ${id}
    RETURNING id, name, avatar
  `;
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    avatar: (row.avatar || "boy1") as AvatarId,
  };
}

export async function deleteUser(id: string): Promise<boolean> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`
    DELETE FROM users
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}
