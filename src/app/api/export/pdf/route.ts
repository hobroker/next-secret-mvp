import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

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

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (d) => chunks.push(d));

  doc.fontSize(18).text("Revenue Opportunities Report", { align: "left" });
  doc.moveDown();

  items.forEach((item, idx) => {
    doc.fontSize(12).text(`${idx + 1}. ${item.title}`);
    doc.fontSize(10).text(`Status: ${item.status}`);
    if (item.value) doc.text(`Value: $${item.value}`);
    if (item.probability) doc.text(`Probability: ${item.probability}%`);
    if (item.nextAction) doc.text(`Next action: ${new Date(item.nextAction).toDateString()}`);
    doc.moveDown(0.5);
  });

  doc.end();

  const pdf = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(pdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=opportunities.pdf",
    },
  });
}
