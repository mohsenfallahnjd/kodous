import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

function getSql() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL or POSTGRES_URL is required. Add Neon from Vercel Marketplace or set DATABASE_URL."
    );
  }
  return neon(connectionString);
}

export async function initDb() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      avatar TEXT DEFAULT 'boy1'
    )
  `;
  try {
    await sql`ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT 'boy1'`;
  } catch {
    // Column may already exist
  }
  await sql`
    CREATE TABLE IF NOT EXISTS kodous (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "from" TEXT NOT NULL,
      "to" TEXT NOT NULL,
      message TEXT NOT NULL,
      anonymous BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  try {
    await sql`ALTER TABLE kodous ADD COLUMN anonymous BOOLEAN DEFAULT true`;
  } catch {
    // Column may already exist
  }
}

export function getDb() {
  return getSql();
}
