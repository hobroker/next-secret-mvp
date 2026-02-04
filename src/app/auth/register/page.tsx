"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    router.push("/auth/login?registered=1");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-black/40">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-slate-300">
          Sign up to start using the app.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Name
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-sky-400 hover:text-sky-300">
            Log in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
