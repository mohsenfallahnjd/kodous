"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/components/Link";
import { Icon } from "@/components/Icon";

export default function SendPage() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/sent/${data.kodu.id}`);
    } catch {
      setError("Failed to send. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 px-4 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          ← Back
        </Link>
        <div className="mb-8 flex items-center gap-2">
          <Icon name="gift" size={32} className="text-amber-500" />
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Send a Kodu
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="from"
              className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              From
            </label>
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>
          <div>
            <label
              htmlFor="to"
              className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              To
            </label>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipient's name"
              required
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something kind..."
              required
              rows={4}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
          >
            <Icon name="send" size={20} />
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
