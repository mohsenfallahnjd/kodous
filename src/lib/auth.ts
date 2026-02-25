import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  loggedIn: boolean;
  username?: string;
  role?: "admin" | "member";
};

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "kodous_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export function validateCredentials(username: string, password: string): {
  ok: boolean;
  role?: "admin" | "member";
  username?: string;
} {
  const adminUser = process.env.AUTH_USERNAME;
  const adminPass = process.env.AUTH_PASSWORD;
  const memberUser = process.env.USER_USERNAME;
  const memberPass = process.env.USER_PASSWORD;

  if (adminUser && adminPass && username === adminUser && password === adminPass) {
    return { ok: true, role: "admin", username };
  }

  if (memberUser && memberPass && username === memberUser && password === memberPass) {
    return { ok: true, role: "member", username };
  }

  return { ok: false };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.loggedIn) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  // Backward-compatible: old sessions without explicit role are treated as admin.
  const isAdmin = session.role ? session.role === "admin" : true;
  if (!isAdmin) {
    throw new Error("Forbidden");
  }
  return session;
}
