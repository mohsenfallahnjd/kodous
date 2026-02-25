"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import { Icon } from "@/components/Icon";

type Kodu = {
  id: string;
  from: string;
  to: string;
  message: string;
  createdAt: string;
};

export default function ViewPage() {
  const [name, setName] = useState("");
  const [kodus, setKodus] = useState<Kodu[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setKodus(null);
    try {
      const res = await fetch(`/api/kudos?to=${encodeURIComponent(name.trim())}`);
      const data = await res.json();
      setKodus(data.kodus || []);
    } catch {
      setKodus([]);
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
          <Icon name="heart" size={32} className="text-amber-500" />
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            My Kodous
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? "..." : "View"}
            </button>
          </div>
        </form>
        {kodus !== null && (
          <>
            {kodus.length === 0 ? (
              <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-500 dark:border-stone-600 dark:bg-stone-800">
                No kodous for you yet. Share Kodous with your team!
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {kodus.map((k) => (
                  <li key={k.id}>
                    <Link
                      href={`/sent/${k.id}`}
                      className="block rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-amber-600"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-900 dark:text-stone-100">
                          From {k.from}
                        </span>
                        <Icon name="heart" size={18} className="text-amber-500" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-600 dark:text-stone-400">
                        {k.message}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
