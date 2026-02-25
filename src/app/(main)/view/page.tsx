"use client";

import { useState, useEffect } from "react";
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

export default function ViewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState("");
  const [kodus, setKodus] = useState<Kodu[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  function handleAvatarClick(name: string) {
    setSelected(name);
    setKodus(null);
    if (name) {
      setLoading(true);
      fetch(`/api/kudos?to=${encodeURIComponent(name)}`)
        .then((r) => r.json())
        .then((data) => setKodus(data.kodus || []))
        .finally(() => setLoading(false));
    }
  }

  const userMap = Object.fromEntries(users.map((u) => [u.name, u]));

  return (
    <div className="relative min-h-screen px-6 py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-10 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back
        </Link>
        <h1 className="kd-title mb-2 text-3xl">
          My kodous
        </h1>
        <p className="kd-subtitle mb-6">
          Tap an avatar to see their kodous.
        </p>
        {users.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">
              <Link href="/users">Add your team</Link> first.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleAvatarClick(u.name)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 transition-colors ${
                    selected === u.name
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]/50"
                      : "border-[var(--border)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <Avatar id={u.avatar || "boy1"} size={56} />
                  <span className="text-sm font-medium">{u.name}</span>
                </button>
              ))}
            </div>
            {loading ? (
              <p className="text-center text-sm text-[var(--muted)]">Loading...</p>
            ) : (
              kodus !== null && (
                kodus.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center">
                    <p className="text-sm text-[var(--muted)]">No kodous yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {kodus.map((k) => (
                      <Link
                        key={k.id}
                        href={`/sent/${k.id}`}
                        className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 transition-colors hover:border-[var(--accent)]/40"
                      >
                        <Avatar
                          id={k.from === "Someone" ? "anonymous" : userMap[k.from]?.avatar || "boy1"}
                          size={44}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs text-[var(--muted)]">From {k.from}</span>
                          <p className="mt-0.5 line-clamp-2 text-sm">{k.message}</p>
                        </div>
                      </Link>
                    ))}
                  </ul>
                )
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
