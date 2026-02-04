import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  return NextResponse.json({ ok: true });
}
