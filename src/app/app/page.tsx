import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app");
  }

  const userId = (session.user as { id?: string })?.id;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  if (user && !user.onboarded) {
    redirect("/app/onboarding");
  }

  const items = userId
    ? await prisma.item.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  const recent = items.slice(0, 5);
  const drafts = items.filter((item) => item.status === "draft").slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl grid gap-6">
      <Card className="bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-950 dark:text-red-50">Welcome back</CardTitle>
          <p className="text-sm text-red-700/70 dark:text-red-200/70">
            Your command center for revenue opportunities.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/app/opportunities"
            className="rounded-md border border-red-800 px-3 py-2 text-red-900 dark:text-red-100 hover:border-red-500"
          >
            New opportunity
          </Link>
          <Link
            href="/app/templates"
            className="rounded-md border border-red-800 px-3 py-2 text-red-900 dark:text-red-100 hover:border-red-500"
          >
            Use a template
          </Link>
          <Link
            href="/app/opportunities"
            className="rounded-md border border-red-800 px-3 py-2 text-red-900 dark:text-red-100 hover:border-red-500"
          >
            Review pipeline
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recent.length === 0 ? (
              <p className="text-red-700/70 dark:text-red-200/70">No activity yet.</p>
            ) : (
              recent.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-red-950 dark:text-red-50">{item.title}</span>
                  <span className="text-xs text-red-700/60 dark:text-red-200/60">
                    {new Date(item.updatedAt).toDateString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Drafts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {drafts.length === 0 ? (
              <p className="text-red-700/70 dark:text-red-200/70">No drafts yet.</p>
            ) : (
              drafts.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-red-950 dark:text-red-50">{item.title}</span>
                  <Badge variant="outline" className="border-red-800 text-red-800 dark:text-red-200">
                    draft
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Quick stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-red-700/70 dark:text-red-200/70">
            <p>Total opportunities: {items.length}</p>
            <p>Drafts: {drafts.length}</p>
            <p>Last updated: {items[0] ? new Date(items[0].updatedAt).toDateString() : "—"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
