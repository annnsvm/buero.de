import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password_hash },
      select: { id: true, email: true, role: true, created_at: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
