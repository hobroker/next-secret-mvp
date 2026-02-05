import { Item } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stages = ["draft", "idea", "qualified", "proposal", "won", "lost"] as const;

export default function Chart({ items }: { items: Item[] }) {
  const counts = stages.map(
    (stage) => items.filter((item) => item.status === stage).length
  );
  const max = Math.max(1, ...counts);

  return (
    <Card className="bg-black/70 border-red-900/40">
      <CardHeader>
        <CardTitle className="text-sm text-red-200">Pipeline health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  );
}
