import { Item } from "@/generated/prisma/client";

export default function StatsCards({ items }: { items: Item[] }) {
  const total = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.value ?? 0), 0);
  const expected = items.reduce(
    (sum, item) => sum + ((item.value ?? 0) * (item.probability ?? 0)) / 100,
    0
  );
  const nextActions = items.filter((item) => item.nextAction).length;

  const cards = [
    { label: "Total opportunities", value: total },
    { label: "Pipeline value", value: `$${totalValue}` },
    { label: "Weighted forecast", value: `$${Math.round(expected)}` },
    { label: "Next actions", value: nextActions },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-red-900/40 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-wide text-red-400/80">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-red-100">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
