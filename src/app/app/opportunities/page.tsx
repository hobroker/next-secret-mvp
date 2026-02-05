import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import ItemForm from "../ItemForm";
import StatsCards from "../StatsCards";
import Chart from "../Chart";
import ExportButtons from "../ExportButtons";
import SavedViewsClient from "./SavedViewsClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app");
  }

  const userId = (session.user as { id?: string })?.id;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  if (user && !user.onboarded) {
    redirect("/app/onboarding");
  }

  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "all";
  const favorite = typeof params.favorite === "string" ? params.favorite : "";
  const minValue = typeof params.min === "string" && params.min !== "" ? Number(params.min) : undefined;
  const maxValue = typeof params.max === "string" && params.max !== "" ? Number(params.max) : undefined;

  const where: Prisma.ItemWhereInput = { userId };
  const andFilters: Prisma.ItemWhereInput[] = [];
  if (q) andFilters.push({ title: { contains: q } });
  if (status && status !== "all") andFilters.push({ status });
  if (favorite === "1") andFilters.push({ isFavorite: true });
  if (typeof minValue === "number" && !Number.isNaN(minValue)) {
    andFilters.push({ value: { gte: minValue } });
  }
  if (typeof maxValue === "number" && !Number.isNaN(maxValue)) {
    andFilters.push({ value: { lte: maxValue } });
  }
  if (andFilters.length) where.AND = andFilters;

  const items = userId
    ? await prisma.item.findMany({
        where,
        orderBy: { createdAt: "desc" },
      })
    : [];

  const savedViews = userId
    ? await prisma.savedView.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl grid gap-6">
      <StatsCards items={items} />

      <Card className="bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-50">Search & filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="grid gap-4 md:grid-cols-4">
            <Input name="q" placeholder="Search titles" defaultValue={q} />
            <Input name="min" placeholder="Min value" type="number" defaultValue={params.min ?? ""} />
            <Input name="max" placeholder="Max value" type="number" defaultValue={params.max ?? ""} />
            <select
              name="status"
              defaultValue={status}
              className="h-10 rounded-md border border-red-800 bg-black/70 px-3 text-sm text-red-200"
            >
              {"all,draft,idea,qualified,proposal,won,lost".split(",").map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-red-200/70">
              <input
                type="checkbox"
                name="favorite"
                value="1"
                defaultChecked={favorite === "1"}
                className="h-4 w-4 rounded border-red-800 bg-black/50"
              />
              Favorites only
            </label>
            <Button type="submit" className="bg-red-600 hover:bg-red-500">Apply</Button>
            <Link
              href="/app/opportunities"
              className="text-xs text-red-200/70 hover:text-red-100"
            >
              Clear filters
            </Link>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-50">Saved views</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SavedViewsClient />
          <div className="flex flex-wrap gap-2 text-xs">
            {savedViews.length === 0 ? (
              <span className="text-red-200/70">No saved views yet.</span>
            ) : (
              savedViews.map((view) => {
                const query = new URLSearchParams(view.query as Record<string, string>).toString();
                return (
                  <Link
                    key={view.id}
                    href={`/app/opportunities?${query}`}
                    className="rounded-md border border-red-800 px-3 py-1 text-red-100 hover:border-red-500"
                  >
                    {view.name}
                  </Link>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="bg-black/70 border-red-900/40">
          <CardHeader>
            <CardTitle className="text-red-50">Revenue Opportunities</CardTitle>
            <p className="text-sm text-red-200/70">
              Track, score, and prioritize money‑making ideas. Exportable. Sellable. Ruthless.
            </p>
          </CardHeader>
          <CardContent>
            <ItemForm />
          </CardContent>
        </Card>

        <Chart items={items} />
      </div>

      <Card className="bg-black/70 border-red-900/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-red-100">Your entries</CardTitle>
          <ExportButtons />
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-red-200/70">No entries yet. Add one above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Next action</TableHead>
                  <TableHead>Favorite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-red-50">
                      {item.title}
                      {item.data && typeof item.data === "object" && "details" in item.data ? (
                        <p className="text-xs text-red-200/70">
                          {(item.data as { details?: string }).details}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-800 text-red-200">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.value ? `$${item.value}` : "—"}</TableCell>
                    <TableCell>{item.probability ? `${item.probability}%` : "—"}</TableCell>
                    <TableCell>
                      {item.nextAction ? new Date(item.nextAction).toDateString() : "—"}
                    </TableCell>
                    <TableCell>{item.isFavorite ? "★" : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
