import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { refreshCookieName } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") ?? "";
    const match = cookie.match(new RegExp(`${refreshCookieName}=([^;]+)`));
    const refreshToken = match?.[1];

    if (refreshToken) {
      const tokenHash = hashToken(decodeURIComponent(refreshToken));

      await prisma.refreshToken.updateMany({
        where: { token_hash: tokenHash, revoked_at: null },
        data: { revoked_at: new Date() },
      });
    }

    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set(refreshCookieName, "", { maxAge: 0, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
