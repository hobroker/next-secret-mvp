import { Item } from "@/generated/prisma/client";

const stages = ["idea", "qualified", "proposal", "won", "lost"] as const;

export default function Chart({ items }: { items: Item[] }) {
  const counts = stages.map(
    (stage) => items.filter((item) => item.status === stage).length
  );
  const max = Math.max(1, ...counts);

  return (
    <div className="rounded-2xl border border-red-900/40 bg-black/60 p-5">
      <h3 className="text-sm font-semibold text-red-200">Pipeline health</h3>
      <div className="mt-4 space-y-3">
        {stages.map((stage, idx) => (
          <div key={stage} className="space-y-1">
            <div className="flex justify-between text-xs text-red-200/70">
              <span className="capitalize">{stage}</span>
              <span>{counts[idx]}</span>
            </div>
            <div className="h-2 rounded-full bg-red-950/80">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${(counts[idx] / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
