import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app/insights");
  }

  const userId = (session.user as { id?: string })?.id;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  if (user && !user.onboarded) {
    redirect("/app/onboarding");
  }

  const items = userId
    ? await prisma.item.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const totalValue = items.reduce((sum, item) => sum + (item.value ?? 0), 0);
  const favoriteCount = items.filter((item) => item.isFavorite).length;
  const averageValue = items.length ? Math.round(totalValue / items.length) : 0;

  const statusCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl grid gap-6">
      <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-950 dark:text-red-50">Insights</CardTitle>
          <p className="text-sm text-red-700/70 dark:text-red-200/70">A quick pulse check on your pipeline.</p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Total value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl text-red-950 dark:text-red-50">${totalValue}</CardContent>
        </Card>
        <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Average value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl text-red-950 dark:text-red-50">${averageValue}</CardContent>
        </Card>
        <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Favorites</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl text-red-950 dark:text-red-50">{favoriteCount}</CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-900 dark:text-red-100">Status breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-red-700/70 dark:text-red-200/70">
          {Object.keys(statusCounts).length === 0 ? (
            <p>No items yet.</p>
          ) : (
            Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span className="capitalize">{status}</span>
                <span>{count}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
