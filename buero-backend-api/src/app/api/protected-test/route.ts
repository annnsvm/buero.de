import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    message: "You are authorized 🎉",
    userId,
  });
}