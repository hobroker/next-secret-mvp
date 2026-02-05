import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-red-900/40 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-red-800 dark:text-red-200">
          Blacklist Revenue Lab
        </Link>
        <nav className="flex items-center gap-4 text-xs text-red-700/70 dark:text-red-200/70">
          <Link href="/app" className="hover:text-red-900 dark:hover:text-red-100">
            Dashboard
          </Link>
          <Link href="/app/opportunities" className="hover:text-red-900 dark:hover:text-red-100">
            Opportunities
          </Link>
          <Link href="/app/templates" className="hover:text-red-900 dark:hover:text-red-100">
            Templates
          </Link>
          <Link href="/app/insights" className="hover:text-red-900 dark:hover:text-red-100">
            Insights
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-xs text-red-700/70 dark:text-red-200/70">
          <ThemeToggle />
          <span>{session.user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button className="rounded-md border border-red-800 px-3 py-1 hover:border-red-400 hover:text-red-900 dark:hover:text-red-100">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
