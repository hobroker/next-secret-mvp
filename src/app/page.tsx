import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <main className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-black/40">
        <h1 className="text-3xl font-semibold tracking-tight">Secret MVP</h1>
        <p className="mt-2 text-sm text-slate-300">
          A small, focused tool built with Next.js, authentication, and a real
          database-backed core feature.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-sky-500/60 hover:text-sky-100"
          >
            Create account
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-100"
          >
            Go to app
          </Link>
        </div>
      </main>
    </div>
  );
}
