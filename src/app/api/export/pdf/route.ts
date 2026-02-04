import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const { height } = page.getSize();
  let y = height - 50;

  page.drawText("Revenue Opportunities Report", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0.9, 0.2, 0.2),
  });
  y -= 30;

  items.forEach((item, idx) => {
    if (y < 80) {
      y = height - 50;
      pdf.addPage();
    }
    page.drawText(`${idx + 1}. ${item.title}`, { x: 50, y, size: 12, font });
    y -= 16;
    page.drawText(`Status: ${item.status}`, { x: 60, y, size: 10, font });
    y -= 12;
    if (item.value) {
      page.drawText(`Value: $${item.value}`, { x: 60, y, size: 10, font });
      y -= 12;
    }
    if (item.probability) {
      page.drawText(`Probability: ${item.probability}%`, { x: 60, y, size: 10, font });
      y -= 12;
    }
    if (item.nextAction) {
      page.drawText(`Next action: ${new Date(item.nextAction).toDateString()}`, { x: 60, y, size: 10, font });
      y -= 12;
    }
    y -= 8;
  });

  const bytes = await pdf.save();

  return new NextResponse(Buffer.from(bytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=opportunities.pdf",
    },
  });
}
