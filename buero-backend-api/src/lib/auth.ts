import jwt from "jsonwebtoken";

export function getUserIdFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as { sub: string };

    return payload.sub;
  } catch {
    return null;
  }
}