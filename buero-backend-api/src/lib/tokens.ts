import jwt from "jsonwebtoken";
import crypto from "crypto";

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string };
}

export function generateRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshExpiresAt() {
  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}
