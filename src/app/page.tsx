import { Link } from "@/components/Link";
import { Icon } from "@/components/Icon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4 dark:bg-stone-950">
      <main className="flex max-w-md flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-2">
          <Icon name="gift" size={40} className="text-amber-500" />
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Kodous
          </h1>
        </div>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Send appreciation to your team. Simple, kind, and personal.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/send"
            className="flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-medium text-white no-underline transition-colors hover:bg-amber-600 hover:no-underline"
          >
            <Icon name="send" size={20} />
            Send a Kodu
          </Link>
          <Link
            href="/sent"
            className="flex items-center justify-center gap-2 rounded-full border border-amber-500/50 px-6 py-3 font-medium text-amber-700 no-underline transition-colors hover:bg-amber-500/10 hover:no-underline dark:text-amber-400"
          >
            <Icon name="sparkles" size={20} />
            View Sent
          </Link>
          <Link
            href="/view"
            className="flex items-center justify-center gap-2 rounded-full border border-amber-500/50 px-6 py-3 font-medium text-amber-700 no-underline transition-colors hover:bg-amber-500/10 hover:no-underline dark:text-amber-400"
          >
            <Icon name="heart" size={20} />
            My Kodous
          </Link>
        </div>
      </main>
    </div>
  );
}
