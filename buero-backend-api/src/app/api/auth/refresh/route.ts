import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  refreshExpiresAt,
} from "@/lib/tokens";
import { refreshCookieName, refreshCookieOptions } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") ?? "";
    const match = cookie.match(new RegExp(`${refreshCookieName}=([^;]+)`));
    const refreshToken = match?.[1];

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const tokenHash = hashToken(decodeURIComponent(refreshToken));

    const stored = await prisma.refreshToken.findUnique({
      where: { token_hash: tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revoked_at || stored.expires_at < new Date()) {
      return NextResponse.json({ message: "Refresh token invalid" }, { status: 401 });
    }

    const newRefresh = generateRefreshToken();
    const newHash = hashToken(newRefresh);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { token_hash: tokenHash },
        data: { revoked_at: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          user_id: stored.user_id,
          token_hash: newHash,
          expires_at: refreshExpiresAt(),
        },
      }),
    ]);

    const accessToken = signAccessToken(stored.user_id);

    const res = NextResponse.json({ accessToken });
    res.cookies.set(refreshCookieName, newRefresh, refreshCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
