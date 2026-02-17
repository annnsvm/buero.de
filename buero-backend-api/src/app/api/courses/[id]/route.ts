import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const course = await prisma.course.findFirst({
    where: { id: params.id, is_published: true },
    select: {
      id: true,
      level: true,
      title: true,
      description: true,
      lessons: {
        where: { is_published: true },
        orderBy: { order_index: "asc" },
        select: { id: true, title: true, order_index: true },
      },
    },
  });

  if (!course) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ course });
}
