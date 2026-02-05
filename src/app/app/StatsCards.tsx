import { Item } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card key={card.label} className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-red-300/80">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-950 dark:text-red-50">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
