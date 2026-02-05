import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ItemForm from "../ItemForm";
import StatsCards from "../StatsCards";
import Chart from "../Chart";
import ExportButtons from "../ExportButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function OpportunitiesPage() {
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
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl grid gap-6">
      <StatsCards items={items} />

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
