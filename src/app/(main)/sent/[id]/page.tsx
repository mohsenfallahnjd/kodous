import { notFound } from "next/navigation";
import { Link } from "@/components/Link";
import { Avatar } from "@/components/Avatar";
import { getKodu } from "@/lib/kudos";
import { getUsers } from "@/lib/users";

export default async function KoduPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [kodu, users] = await Promise.all([getKodu(id), getUsers()]);

  if (!kodu) {
    notFound();
  }

  const userMap = Object.fromEntries(users.map((u) => [u.name, u]));
  const date = new Date(kodu.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen px-6 py-14">
      <div className="mx-auto max-w-md">
        <Link href="/sent" className="mb-10 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back
        </Link>
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-8">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Avatar
              id={kodu.from === "Someone" ? "anonymous" : userMap[kodu.from]?.avatar || "boy1"}
              size={56}
            />
            <span className="text-[var(--muted)]">→</span>
            <Avatar id={userMap[kodu.to]?.avatar || "girl1"} size={56} />
          </div>
          <p className="mb-4 text-center text-xs text-[var(--muted)]">{date}</p>
          <blockquote className="kd-title mb-6 text-center text-2xl leading-relaxed">
            "{kodu.message}"
          </blockquote>
          <footer className="border-t border-[var(--border)] pt-4 text-center">
            <p className="text-sm text-[var(--muted)]">
              {kodu.from} → {kodu.to}
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
