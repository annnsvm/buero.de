import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, created_at: true },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
