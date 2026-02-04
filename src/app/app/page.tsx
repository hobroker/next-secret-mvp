import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AppPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold">
          Secret MVP
        </Link>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span>{session.user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button className="rounded-md border border-slate-700 px-3 py-1 hover:border-red-500/70 hover:text-red-300">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/40">
          <h1 className="text-2xl font-semibold tracking-tight">Your dashboard</h1>
          <p className="mt-1 text-sm text-slate-300">
            This is the main, monetizable feature area of the app.
          </p>
        </div>
      </main>
    </div>
  );
}
