export const refreshCookieName = "refresh_token";

export function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30") * 24 * 60 * 60,
  };
}
