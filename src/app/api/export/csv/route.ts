import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const header = ["title","status","value","probability","expected","nextAction","createdAt"].join(",");
  const rows = items.map((item) => {
    const expected = item.value && item.probability
      ? Math.round((item.value * item.probability) / 100)
      : "";
    return [
      item.title,
      item.status,
      item.value ?? "",
      item.probability ?? "",
      expected,
      item.nextAction ? new Date(item.nextAction).toISOString() : "",
      new Date(item.createdAt).toISOString(),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=opportunities.csv",
    },
  });
}
