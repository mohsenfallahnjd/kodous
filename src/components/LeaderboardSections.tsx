import { Avatar } from "@/components/Avatar";

export type LeaderboardEntry = { name: string; count: number; rank: number };
export type LeaderboardUser = { id: string; name: string; avatar: string };

type LeaderboardSectionsProps = {
  entries: LeaderboardEntry[];
  users: LeaderboardUser[];
  title?: string;
  includeTopThreeInList?: boolean;
  showPodium?: boolean;
};

function PodiumCard({
  entry,
  avatar,
  featured,
  imgSize,
}: {
  entry: LeaderboardEntry;
  avatar: string;
  featured?: boolean;
  imgSize?: number;
}) {
  return (
    <article
      className={`rounded-2xl border bg-[var(--card)] px-3 py-4 text-center ${
        featured ? "border-[var(--accent)]/40 shadow-[var(--shadow-soft)]" : "border-[var(--border)]"
      }`}
    >
      <div className="mb-2 flex justify-center">
        <Avatar id={avatar} size={featured ? 66 : 54} imgSize={imgSize} />
      </div>
      <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">#{entry.rank}</p>
      <p className="truncate text-[15px] font-semibold">{entry.name}</p>
      <p className="text-xs text-[var(--muted)]">
        {entry.count} {entry.count === 1 ? "kodu" : "kodous"}
      </p>
    </article>
  );
}

export function LeaderboardSections({
  entries,
  users,
  title,
  includeTopThreeInList = false,
  showPodium = true,
}: LeaderboardSectionsProps) {
  const userMap = Object.fromEntries(users.map((u) => [u.name, u]));
  const topThree = entries.slice(0, 3);
  const listEntries = includeTopThreeInList ? entries : entries.slice(3);

  return (
    <section>
      {title ? <h2 className="kd-title mb-4 text-xl">{title}</h2> : null}

      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
          No kodous this week yet.
        </p>
      ) : (
        <>
          {showPodium ? (
            <div className="mb-7 grid grid-cols-3 gap-2.5">
              {topThree[1] ? (
                <PodiumCard entry={topThree[1]} avatar={userMap[topThree[1].name]?.avatar || "boy1"} />
              ) : (
                <div />
              )}
              {topThree[0] ? (
                <PodiumCard
                  entry={topThree[0]}
                  avatar={userMap[topThree[0].name]?.avatar || "boy1"}
                  featured
                  imgSize={56}
                />
              ) : (
                <div />
              )}
              {topThree[2] ? (
                <PodiumCard entry={topThree[2]} avatar={userMap[topThree[2].name]?.avatar || "boy1"} />
              ) : (
                <div />
              )}
            </div>
          ) : null}

          <ul className="space-y-2.5">
            {listEntries.map((entry) => (
              <li
                key={entry.name}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--accent)]/25"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                  {entry.rank}
                </span>
                <Avatar id={userMap[entry.name]?.avatar || "boy1"} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {entry.count} {entry.count === 1 ? "kodu" : "kodous"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
