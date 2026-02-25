"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { Icon } from "@/components/Icon";

type Kodu = {
  id: string;
  from: string;
  to: string;
  message: string;
  createdAt: string;
};

export default function SentPage() {
  const [kodus, setKodus] = useState<Kodu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kudos")
      .then((res) => res.json())
      .then((data) => setKodus(data.kodus || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 px-4 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          ← Back
        </Link>
        <div className="mb-8 flex items-center gap-2">
          <Icon name="sparkles" size={32} className="text-amber-500" />
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            All Kodous
          </h1>
        </div>
        {loading ? (
          <p className="text-stone-500">Loading...</p>
        ) : kodus.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-500 dark:border-stone-600 dark:bg-stone-800">
            No kodous yet.{" "}
            <Link href="/send">Send the first one!</Link>
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
                      {k.from} → {k.to}
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
      </div>
    </div>
  );
}
