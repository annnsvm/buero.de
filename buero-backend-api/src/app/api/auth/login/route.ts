import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const REFRESH_COOKIE = "refresh_token";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const accessToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    const refresh = generateRefreshToken();
    const token_hash = hashToken(refresh);

    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
    const expires_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: { user_id: user.id, token_hash, expires_at },
    });

    const res = NextResponse.json({
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    });

    res.cookies.set(REFRESH_COOKIE, refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: days * 24 * 60 * 60,
    });

    return res;
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
