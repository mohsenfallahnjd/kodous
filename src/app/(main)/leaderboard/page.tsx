import { Link } from "@/components/Link";
import { LeaderboardSections } from "@/components/LeaderboardSections";
import { getWeeklyLeaderboard } from "@/lib/kudos";
import { getUsers } from "@/lib/users";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const activeWeek = week === "last" ? "last" : "current";
  const [entries, users] = await Promise.all([
    getWeeklyLeaderboard(activeWeek),
    getUsers(),
  ]);
  const total = entries.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="relative min-h-screen px-6 py-14">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="mb-10 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back
        </Link>
        <h1 className="kd-display mb-2 text-3xl">
          Leaderboard
        </h1>
        <p className="kd-subtitle mb-4">
          Weekly ranking by received kodous.
        </p>
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
            {activeWeek === "current" ? "Current week" : "Last week"} summary
          </p>
          <p className="mt-1 text-sm">
            {entries.length} ranked • {total} total kodous
          </p>
        </div>

        <div className="mb-7 inline-flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
          <Link
            href="/leaderboard?week=current"
            className={`rounded-md px-3 py-1.5 text-xs no-underline ${
              activeWeek === "current"
                ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                : "text-[var(--muted)]"
            }`}
          >
            This week
          </Link>
          <Link
            href="/leaderboard?week=last"
            className={`rounded-md px-3 py-1.5 text-xs no-underline ${
              activeWeek === "last"
                ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                : "text-[var(--muted)]"
            }`}
          >
            Last week
          </Link>
        </div>

        <LeaderboardSections
          entries={entries}
          users={users}
          title="Top 3"
        />
        {entries.length > 3 ? (
          <div className="mt-8">
            <LeaderboardSections
              entries={entries}
              users={users}
              title="Full ranking"
              includeTopThreeInList
              showPodium={false}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
