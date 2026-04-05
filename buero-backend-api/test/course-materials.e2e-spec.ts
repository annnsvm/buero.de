import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";

function cookieHeaderFromRegister(headers: {
  "set-cookie"?: string | string[];
}): string {
  const raw = headers["set-cookie"];
  if (!raw) return "";
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.map((c) => c.split(";")[0]).join("; ");
}

describe("Course materials (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const password = "E2ePass123";

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "E2E: DATABASE_URL не задано. Вкажи .env з робочою PostgreSQL.",
      );
    }
    app = await createE2eApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it("401 без cookie; 403 студент без доступу; video + teacher GET list", async () => {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const teacherReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: `t_mat_${suffix}@test.local`,
        password,
        role: "teacher",
        language: "en",
      })
      .expect(201);
    const teacherCookie = cookieHeaderFromRegister(teacherReg.headers);

    const course = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: `E2E Materials ${suffix}`,
        language: "en",
        is_published: true,
      })
      .expect(201);
    const courseId = course.body.id as string;

    const mod = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules`)
      .set("Cookie", teacherCookie)
      .send({ title: "Mod 1", order_index: 0 })
      .expect(201);
    const moduleId = mod.body.id as string;

    const base = `/api/courses/${courseId}/modules/${moduleId}/materials`;

    await request(app.getHttpServer()).get(base).expect(401);

    const studentReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: `s_mat_${suffix}@test.local`,
        password,
        role: "student",
        language: "en",
      })
      .expect(201);
    const studentCookie = cookieHeaderFromRegister(studentReg.headers);

    await request(app.getHttpServer())
      .get(base)
      .set("Cookie", studentCookie)
      .expect(403);

    const video = await request(app.getHttpServer())
      .post(base)
      .set("Cookie", teacherCookie)
      .send({
        type: "video",
        title: "Intro video",
        content: { youtube_video_id: "dQw4w9WgXcQ" },
        order_index: 0,
      })
      .expect(201);

    expect(video.body.content).toMatchObject({
      youtube_video_id: "dQw4w9WgXcQ",
    });

    const list = await request(app.getHttpServer())
      .get(base)
      .set("Cookie", teacherCookie)
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(
      list.body.some(
        (m: { id: string }) => m.id === (video.body.id as string),
      ),
    ).toBe(true);

    await request(app.getHttpServer())
      .delete(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .expect(200);

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [`t_mat_${suffix}@test.local`, `s_mat_${suffix}@test.local`],
        },
      },
    });
  });
});
