"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/components/Link";
import { Avatar } from "@/components/Avatar";

type User = { id: string; name: string; avatar: string };

const EMOJIS = ["👍", "🎉", "💪", "⭐", "🙌", "❤️"];
const QUICK_MESSAGES = [
  "Great job!",
  "Thanks for helping!",
  "You're awesome!",
  "Made my day",
  "Team player",
];

export default function SendPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  function appendToMessage(text: string) {
    setMessage((prev) => (prev ? `${prev} ${text}` : text));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const msg = message.trim();
    if (!msg) {
      setError("Pick an emoji, quick message, or type something.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message: msg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/sent/${data.kodu.id}`);
    } catch {
      setError("Failed to send.");
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
        <h1 className="kd-title mb-2 text-3xl">
          Send
        </h1>
        <p className="kd-subtitle mb-6">
          Anonymous — they won't know who sent it.
        </p>
        {users.length < 2 ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-8">
            <p className="text-sm text-[var(--muted)]">
              Add at least 2 team members <Link href="/users">here</Link> first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="kd-label mb-3 block">To</label>
              <div className="flex flex-wrap justify-center gap-3">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setTo(u.name)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 transition-colors ${
                      to === u.name
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]/50"
                        : "border-[var(--border)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    <Avatar id={u.avatar || "boy1"} size={56} />
                    <span className="text-sm font-medium">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="kd-label mb-2 block">Message</label>
              <div className="mb-3 flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => appendToMessage(emoji)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xl transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]/30"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_MESSAGES.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => appendToMessage(text)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]/30"
                  >
                    {text}
                  </button>
                ))}
              </div>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Or type your own message..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || !to}
              className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
