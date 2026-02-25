"use client";

import { useState, useEffect } from "react";
import { Link } from "@/components/Link";
import { Avatar, AVATARS } from "@/components/Avatar";

type User = { id: string; name: string; avatar: string };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("boy1");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
  }

  async function loadSession() {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    setIsAdmin(!!data.isAdmin);
  }

  useEffect(() => {
    loadUsers();
    loadSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: name.trim(),
          avatar,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save user");
        return;
      }
      setName("");
      setAvatar("boy1");
      setEditingId(null);
      await loadUsers();
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setAvatar(user.avatar || "boy1");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setAvatar("boy1");
    setError("");
  }

  async function handleDelete(userId: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete user");
        return;
      }
      if (editingId === userId) {
        cancelEdit();
      }
      await loadUsers();
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[0.95rem] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

  return (
    <div className="relative min-h-screen px-6 py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-10 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back
        </Link>
        <h1 className="kd-title mb-8 text-3xl">Team</h1>
        {isAdmin ? (
          <form onSubmit={handleSubmit} className="mb-10 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={inputClass}
            />
            <div>
              <p className="kd-label mb-3">Choose avatar</p>
              <div className="flex flex-wrap justify-center gap-3">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    style={{ width: "56px", height: "56px" }}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`rounded-full transition-all ${
                      avatar === a ? "ring-2 ring-[var(--accent)]" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Avatar id={a} size={56} />
                  </button>
                ))}
              </div>
            </div>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {editingId ? "Save changes" : "Add member"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        ) : (
          <div className="mb-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <p className="text-sm text-[var(--muted)]">
              You are in read-only mode. Only admin can add, edit, or delete members.
            </p>
          </div>
        )}
        {users.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">No team members yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4"
              >
                <Avatar id={u.avatar || "boy1"} size={48} />
                <span className="flex-1 text-sm font-medium">{u.name}</span>
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => startEdit(u)} className="text-xs text-[var(--accent)]">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(u.id)} className="text-xs text-red-600">
                      Delete
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
