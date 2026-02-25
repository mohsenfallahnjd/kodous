"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { Avatar } from "@/components/Avatar";

type Kodu = {
  id: string;
  from: string;
  to: string;
  message: string;
  createdAt: string;
};

type User = { id: string; name: string; avatar: string };

export default function SentPage() {
  const [kodus, setKodus] = useState<Kodu[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/kudos").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ]).then(([kData, uData]) => {
      setKodus(kData.kodus || []);
      setUsers(uData.users || []);
    }).finally(() => setLoading(false));
  }, []);

  const userMap = Object.fromEntries(users.map((u) => [u.name, u]));

  return (
    <div className="relative min-h-screen px-6 py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-10 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back
        </Link>
        <h1 className="kd-title mb-8 text-3xl">
          Sent
        </h1>
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading...</p>
        ) : kodus.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">No kodous yet.</p>
            <p className="mt-2">
              <Link href="/send" className="text-sm font-medium">Send one</Link>
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {kodus.map((k) => (
              <Link
                key={k.id}
                href={`/sent/${k.id}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 transition-colors hover:border-[var(--accent)]/40"
              >
                <div className="flex -space-x-2">
                  <Avatar
                    id={k.from === "Someone" ? "anonymous" : userMap[k.from]?.avatar || "boy1"}
                    size={44}
                    className="ring-2 ring-[var(--card)]"
                  />
                  <Avatar
                    id={userMap[k.to]?.avatar || "girl1"}
                    size={44}
                    className="ring-2 ring-[var(--card)]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-[var(--muted)]">{k.from} → {k.to}</span>
                  <p className="mt-0.5 line-clamp-2 text-sm">{k.message}</p>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
