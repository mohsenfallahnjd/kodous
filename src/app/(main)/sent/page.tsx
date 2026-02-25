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
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/kudos").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/auth/session").then((r) => r.json()),
    ])
      .then(([kData, uData, sData]) => {
        setKodus(kData.kodus || []);
        setUsers(uData.users || []);
        setIsAdmin(!!sData.isAdmin);
      })
      .finally(() => setLoading(false));
  }, []);

  const userMap = Object.fromEntries(users.map((u) => [u.name, u]));

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this kodu record?")) {
      return;
    }
    setError("");
    setActionBusy(id);
    try {
      const res = await fetch(`/api/kudos/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to remove kodu");
        return;
      }
      setKodus((prev) => prev.filter((k) => k.id !== id));
    } finally {
      setActionBusy(null);
    }
  }

  async function handleResetAll() {
    if (!window.confirm("Reset all kodous? This cannot be undone.")) {
      return;
    }
    setError("");
    setActionBusy("reset-all");
    try {
      const res = await fetch("/api/kudos", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to reset kodous");
        return;
      }
      setKodus([]);
    } finally {
      setActionBusy(null);
    }
  }

  return (
    <div className="relative min-h-screen px-6 py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-10 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back
        </Link>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="kd-title text-3xl">Sent</h1>
          {isAdmin && kodus.length > 0 ? (
            <button
              type="button"
              onClick={handleResetAll}
              disabled={actionBusy !== null}
              className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset all
            </button>
          ) : null}
        </div>
        {error ? <p className="mb-4 text-xs text-red-600">{error}</p> : null}
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
              <li
                key={k.id}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2"
              >
                <Link
                  href={`/sent/${k.id}`}
                  className="flex min-w-0 flex-1 items-center gap-4 rounded-lg px-2 py-2 no-underline transition-colors hover:bg-black/5"
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
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(k.id)}
                    disabled={actionBusy !== null}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
