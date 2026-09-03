import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { UserCourseAccessType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";
import { registerVerified } from "./helpers/register-verified";

function cookieHeaderFromRegister(headers: {
  "set-cookie"?: string | string[];
}): string {
  const raw = headers["set-cookie"];
  if (!raw) return "";
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.map((c) => c.split(";")[0]).join("; ");
}

describe("Course structure reorder & material attachments (e2e)", () => {
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

  it("reorders modules and moves a material across modules; rejects foreign ids", async () => {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const teacherReg = await registerVerified(app, {
      email: `t_struct_${suffix}@test.local`,
      password,
      role: "teacher",
      language: "en",
    });
    const teacherCookie = cookieHeaderFromRegister(teacherReg.headers);
    const teacherId = teacherReg.body.user.id as string;

    const course = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: `E2E Structure ${suffix}`,
        language: "en",
        is_published: true,
      })
      .expect(201);
    const courseId = course.body.id as string;

    const modA = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules`)
      .set("Cookie", teacherCookie)
      .send({ title: "Module A", order_index: 0 })
      .expect(201);
    const modB = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules`)
      .set("Cookie", teacherCookie)
      .send({ title: "Module B", order_index: 1 })
      .expect(201);
    const moduleAId = modA.body.id as string;
    const moduleBId = modB.body.id as string;

    const matA = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules/${moduleAId}/materials`)
      .set("Cookie", teacherCookie)
      .send({
        type: "video",
        title: "Lesson in A",
        content: { youtube_video_id: "dQw4w9WgXcQ" },
        order_index: 0,
      })
      .expect(201);
    const matB = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules/${moduleBId}/materials`)
      .set("Cookie", teacherCookie)
      .send({
        type: "quiz",
        title: "Quiz in B",
        content: { questions: [] },
        order_index: 0,
      })
      .expect(201);
    const materialAId = matA.body.id as string;
    const materialBId = matB.body.id as string;

    await request(app.getHttpServer())
      .patch(`/api/courses/${courseId}/structure`)
      .set("Cookie", teacherCookie)
      .send({
        modules: [
          {
            id: "00000000-0000-4000-8000-000000000099",
            order_index: 0,
            materials: [],
          },
        ],
      })
      .expect(404);

    const reordered = await request(app.getHttpServer())
      .patch(`/api/courses/${courseId}/structure`)
      .set("Cookie", teacherCookie)
      .send({
        modules: [
          {
            id: moduleBId,
            order_index: 0,
            materials: [
              { id: materialAId, order_index: 0 },
              { id: materialBId, order_index: 1 },
            ],
          },
          { id: moduleAId, order_index: 1, materials: [] },
        ],
      })
      .expect(200);

    expect(reordered.body[0].id).toBe(moduleBId);
    expect(reordered.body[0].materials.map((m: { id: string }) => m.id)).toEqual(
      [materialAId, materialBId],
    );
    expect(reordered.body[1].id).toBe(moduleAId);
    expect(reordered.body[1].materials).toHaveLength(0);

    const moved = await prisma.courseMaterial.findUnique({
      where: { id: materialAId },
    });
    expect(moved?.moduleId).toBe(moduleBId);
    expect(moved?.orderIndex).toBe(0);

    await request(app.getHttpServer())
      .delete(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .expect(200);

    await prisma.user.deleteMany({
      where: { id: teacherId },
    });
  });

  it("teacher can add/list/delete a link attachment; student access is enforced", async () => {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const teacherReg = await registerVerified(app, {
      email: `t_att_${suffix}@test.local`,
      password,
      role: "teacher",
      language: "en",
    });
    const teacherCookie = cookieHeaderFromRegister(teacherReg.headers);
    const teacherId = teacherReg.body.user.id as string;

    const studentReg = await registerVerified(app, {
      email: `s_att_${suffix}@test.local`,
      password,
      role: "student",
      language: "en",
    });
    const studentCookie = cookieHeaderFromRegister(studentReg.headers);
    const studentId = studentReg.body.user.id as string;

    const course = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: `E2E Attachments ${suffix}`,
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

    const material = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules/${moduleId}/materials`)
      .set("Cookie", teacherCookie)
      .send({
        type: "video",
        title: "Lesson with files",
        content: { youtube_video_id: "dQw4w9WgXcQ" },
        order_index: 0,
      })
      .expect(201);
    const materialId = material.body.id as string;
    const base = `/api/courses/${courseId}/modules/${moduleId}/materials/${materialId}/attachments`;

    await request(app.getHttpServer()).get(base).expect(401);

    await request(app.getHttpServer())
      .get(base)
      .set("Cookie", studentCookie)
      .expect(403);

    const created = await request(app.getHttpServer())
      .post(`${base}/link`)
      .set("Cookie", teacherCookie)
      .send({
        title: "Worksheet",
        url: "https://example.com/worksheet",
      })
      .expect(201);

    expect(created.body).toMatchObject({
      kind: "link",
      title: "Worksheet",
      url: "https://example.com/worksheet",
    });
    expect(created.body.storageKey).toBeUndefined();
    const attachmentId = created.body.id as string;

    await request(app.getHttpServer())
      .post(base)
      .set("Cookie", teacherCookie)
      .expect(400);

    const teacherList = await request(app.getHttpServer())
      .get(base)
      .set("Cookie", teacherCookie)
      .expect(200);
    expect(teacherList.body).toHaveLength(1);
    expect(teacherList.body[0].id).toBe(attachmentId);

    const tree = await request(app.getHttpServer())
      .get(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .expect(200);
    const treeAttachments =
      tree.body.modules?.[0]?.materials?.[0]?.attachments ?? [];
    expect(treeAttachments).toHaveLength(1);
    expect(treeAttachments[0].title).toBe("Worksheet");
    expect(treeAttachments[0].storageKey).toBeUndefined();

    await prisma.userCourseAccess.create({
      data: {
        userId: studentId,
        courseId,
        accessType: UserCourseAccessType.purchase,
      },
    });

    const studentList = await request(app.getHttpServer())
      .get(base)
      .set("Cookie", studentCookie)
      .expect(200);
    expect(studentList.body).toHaveLength(1);
    expect(studentList.body[0].url).toBe("https://example.com/worksheet");

    await request(app.getHttpServer())
      .get(`${base}/${attachmentId}/download`)
      .expect(401);

    await request(app.getHttpServer())
      .get(`${base}/${attachmentId}/download`)
      .set("Cookie", teacherCookie)
      .expect(400);

    await request(app.getHttpServer())
      .delete(`${base}/${attachmentId}`)
      .set("Cookie", teacherCookie)
      .expect(200);

    const emptyList = await request(app.getHttpServer())
      .get(base)
      .set("Cookie", teacherCookie)
      .expect(200);
    expect(emptyList.body).toHaveLength(0);

    await request(app.getHttpServer())
      .delete(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .expect(200);

    await prisma.user.deleteMany({
      where: { id: { in: [teacherId, studentId] } },
    });
  });
});
