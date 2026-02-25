import { Link } from "@/components/Link";
import { Avatar } from "@/components/Avatar";
import { LeaderboardSections } from "@/components/LeaderboardSections";
import { getWeeklyLeaderboard } from "@/lib/kudos";
import { getUsers } from "@/lib/users";

export default async function Home() {
  const [users, current] = await Promise.all([
    getUsers(),
    getWeeklyLeaderboard("current"),
  ]);
  const weeklyTotal = current.reduce((sum, item) => sum + item.count, 0);
  const topName = current[0]?.name ?? "No one yet";
  const topAvatar = users.find((u) => u.name === current[0]?.name)?.avatar ?? "boy1";

  return (
    <div className="relative min-h-screen px-6 py-14">
      <main className="mx-auto w-full max-w-lg">
        <h1 className="kd-display mb-2 text-3xl tracking-tight">
          Kodous
        </h1>
        <p className="kd-subtitle mb-6">
          Weekly leaderboard first. Send appreciation in one tap.
        </p>

        <section className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <p className="kd-label">Team members</p>
            <p className="mt-1 text-2xl font-semibold">{users.length}</p>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <p className="kd-label">Kodous this week</p>
            <p className="mt-1 text-2xl font-semibold">{weeklyTotal}</p>
          </article>
          <article className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)]/50 px-4 py-3">
            <p className="kd-label">Top this week</p>
            <div className="mt-1 flex items-center gap-2">
              <Avatar id={topAvatar} size={28} />
              <p className="truncate text-sm font-semibold">{topName}</p>
            </div>
          </article>
        </section>

        <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="kd-title text-xl">
              This week
            </h2>
            <Link href="/leaderboard" className="text-xs">
              View full leaderboard
            </Link>
          </div>
          <LeaderboardSections entries={current} users={users} />
        </section>

        <nav className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Link
            href="/send"
            className="block rounded-xl border border-[var(--accent)]/35 bg-[var(--accent-soft)]/45 px-4 py-3 no-underline transition-colors hover:border-[var(--accent)]/55"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">Send kodous</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">Appreciate a teammate</p>
          </Link>
          <Link
            href="/view"
            className="block rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 no-underline transition-colors hover:border-[var(--accent)]/30"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">My kodous</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">Read received messages</p>
          </Link>
          <Link
            href="/users"
            className="block rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 no-underline transition-colors hover:border-[var(--accent)]/30"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">Team</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">Manage members & avatars</p>
          </Link>
          <Link
            href="/sent"
            className="block rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 no-underline transition-colors hover:border-[var(--accent)]/30"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">Sent</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">Your sent history</p>
          </Link>
        </nav>
        <form action="/api/auth/logout?redirect=/login" method="POST" className="mt-10">
          <button
            type="submit"
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Sign out
          </button>
        </form>
      </main>
    </div>
  );
}
