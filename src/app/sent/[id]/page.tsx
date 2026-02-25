import { notFound } from "next/navigation";
import { Link } from "@/components/Link";
import { Icon } from "@/components/Icon";
import { getKodu } from "@/lib/kudos";

export default async function KoduPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kodu = getKodu(id);

  if (!kodu) notFound();

  const date = new Date(kodu.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-amber-50 px-4 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-md">
        <Link href="/sent" className="mb-8 inline-flex items-center gap-2">
          ← Back to all
        </Link>
        <article className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm dark:border-amber-800 dark:bg-stone-800">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="gift" size={28} className="text-amber-500" />
            <span className="text-sm text-stone-500">{date}</span>
          </div>
          <p className="mb-4 text-lg text-stone-900 dark:text-stone-100">
            {kodu.message}
          </p>
          <footer className="flex items-center justify-between border-t border-stone-200 pt-4 dark:border-stone-600">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {kodu.from} → {kodu.to}
            </span>
            <Icon name="heart" size={20} className="text-amber-500" />
          </footer>
        </article>
        <p className="mt-6 text-center text-sm text-stone-500">
          Share this link to let {kodu.to} see their kodu:{" "}
          <code className="rounded bg-stone-200 px-1 dark:bg-stone-700">
            /sent/{kodu.id}
          </code>
        </p>
      </div>
    </div>
  );
}
