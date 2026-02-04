import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, details, value, probability, status, nextAction } = await request.json();
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slugBase = slugify(title) || "item";
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const item = await prisma.item.create({
    data: {
      userId,
      title,
      slug,
      status: status || "idea",
      value: typeof value === "number" ? value : null,
      probability: typeof probability === "number" ? probability : null,
      nextAction: nextAction ? new Date(nextAction) : null,
      data: { details: details ?? "" },
    },
  });

  return NextResponse.json({ item });
}
