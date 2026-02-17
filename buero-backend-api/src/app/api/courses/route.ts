import { requireUserId, unauthorized } from "@/lib/requireAuth";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  const userId = requireUserId(req);
  if (!userId) return unauthorized();

  const roleCheck = await requireRole(userId, ["admin", "teacher"]);
  if (!roleCheck.ok) return roleCheck.res;

  const { level, title, description, is_published } = await req.json();

  const course = await prisma.course.create({
    data: {
      level,
      title,
      description: description ?? null,
      is_published: !!is_published,
    },
  });

  return NextResponse.json({ course }, { status: 201 });
}
