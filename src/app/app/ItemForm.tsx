"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ItemForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [value, setValue] = useState("");
  const [probability, setProbability] = useState("50");
  const [status, setStatus] = useState("idea");
  const [nextAction, setNextAction] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        details,
        value: value ? Number(value) : null,
        probability: probability ? Number(probability) : null,
        status,
        nextAction: nextAction || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    setTitle("");
    setDetails("");
    setValue("");
    setProbability("50");
    setStatus("idea");
    setNextAction("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="item-title" className="block text-xs font-medium text-red-200">Title</label>
        <input
          id="item-title"
          className="mt-1 w-full rounded-md border border-red-900/60 bg-black/70 px-3 py-2 text-sm outline-none focus:border-red-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to track?"
          required
        />
      </div>
      <div>
        <label htmlFor="item-details" className="block text-xs font-medium text-red-200">Details</label>
        <textarea
          id="item-details"
          className="mt-1 w-full rounded-md border border-red-900/60 bg-black/70 px-3 py-2 text-sm outline-none focus:border-red-500"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Notes, pain points, targets, etc."
          rows={3}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label htmlFor="item-value" className="block text-xs font-medium text-red-200">Value ($)</label>
          <input
            id="item-value"
            type="number"
            min={0}
            className="mt-1 w-full rounded-md border border-red-900/60 bg-black/70 px-3 py-2 text-sm outline-none focus:border-red-500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="5000"
          />
        </div>
        <div>
          <label htmlFor="item-prob" className="block text-xs font-medium text-red-200">Probability (%)</label>
          <input
            id="item-prob"
            type="number"
            min={0}
            max={100}
            className="mt-1 w-full rounded-md border border-red-900/60 bg-black/70 px-3 py-2 text-sm outline-none focus:border-red-500"
            value={probability}
            onChange={(e) => setProbability(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="item-status" className="block text-xs font-medium text-red-200">Status</label>
          <select
            id="item-status"
            className="mt-1 w-full rounded-md border border-red-900/60 bg-black/70 px-3 py-2 text-sm outline-none focus:border-red-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {"idea,qualified,proposal,won,lost".split(",").map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="item-next" className="block text-xs font-medium text-red-200">Next action date</label>
        <input
          id="item-next"
          type="date"
          className="mt-1 w-full rounded-md border border-red-900/60 bg-black/70 px-3 py-2 text-sm outline-none focus:border-red-500"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
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
        className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add"}
      </button>
    </form>
  );
}
