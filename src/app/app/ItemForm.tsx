"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ItemForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, details }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    setTitle("");
    setDetails("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="item-title" className="block text-xs font-medium text-slate-300">Title</label>
        <input
          id="item-title"
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to track?"
          required
        />
      </div>
      <div>
        <label htmlFor="item-details" className="block text-xs font-medium text-slate-300">Details</label>
        <textarea
          id="item-details"
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Notes, pain points, targets, etc."
          rows={3}
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
        className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add"}
      </button>
    </form>
  );
}
