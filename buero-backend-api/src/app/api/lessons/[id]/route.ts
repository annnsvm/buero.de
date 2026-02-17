import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUserId, unauthorized } from "@/lib/requireAuth";
import { requireRole } from "@/lib/requireRole";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = requireUserId(req);
  if (!userId) return unauthorized();

  const roleCheck = await requireRole(userId, ["admin", "teacher"]);
  if (!roleCheck.ok) return roleCheck.res;

  const { title, video_url, content, order_index, is_published } = await req.json();

  const lesson = await prisma.lesson.create({
    data: {
      course_id: params.id,
      title,
      video_url: video_url ?? null,
      content: content ?? null,
      order_index: Number(order_index ?? 0),
      is_published: !!is_published,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
