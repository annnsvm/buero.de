import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function cookieHeaderFromRegister(headers: { "set-cookie"?: string | string[] }): string {
  return getSetCookieHeaders(headers)
    .map((c) => c.split(";")[0])
    .join("; ");
}

/** Валідний UUID v4, якого майже напевно немає в БД */
const MISSING_ID = "550e8400-e29b-41d4-a716-446655440099";
const MISSING_MODULE_ID = "550e8400-e29b-41d4-a716-446655440088";
const MISSING_MATERIAL_ID = "550e8400-e29b-41d4-a716-446655440077";

describe("Courses, course-modules & course-materials (e2e)", () => {
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

  it("каталог: лише опубліковані; CRUD курсу (teacher); GET :id (student); 404", async () => {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const pubTitle = `E2E Pub ${suffix}`;
    const draftTitle = `E2E Draft ${suffix}`;

    const teacherReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: `t_courses_${suffix}@test.local`,
        password,
        role: "teacher",
        language: "en",
      })
      .expect(201);
    const teacherCookie = cookieHeaderFromRegister(teacherReg.headers);

    const draft = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: draftTitle,
        language: "en",
        is_published: false,
      })
      .expect(201);

    const published = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", teacherCookie)
      .send({
        title: pubTitle,
        language: "en",
        is_published: false,
      })
      .expect(201);

    const draftId = draft.body.id as string;
    const courseId = published.body.id as string;

    await request(app.getHttpServer())
      .patch(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .send({ is_published: true })
      .expect(200);

    const catalog = await request(app.getHttpServer())
      .get("/api/courses")
      .expect(200);

    expect(Array.isArray(catalog.body)).toBe(true);
    const titles = catalog.body.map((c: { title: string }) => c.title);
    expect(titles).toContain(pubTitle);
    expect(titles).not.toContain(draftTitle);

    const studentReg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: `s_courses_${suffix}@test.local`,
        password,
        role: "student",
        language: "en",
      })
      .expect(201);
    const studentCookie = cookieHeaderFromRegister(studentReg.headers);

    const one = await request(app.getHttpServer())
      .get(`/api/courses/${courseId}`)
      .set("Cookie", studentCookie)
      .expect(200);

    expect(one.body.id).toBe(courseId);
    expect(Array.isArray(one.body.modules)).toBe(true);

    await request(app.getHttpServer())
      .get(`/api/courses/${MISSING_ID}`)
      .set("Cookie", studentCookie)
      .expect(404);

    const mod = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules`)
      .set("Cookie", teacherCookie)
      .send({ title: "Module A", order_index: 0 })
      .expect(201);
    const moduleId = mod.body.id as string;

    const modList = await request(app.getHttpServer())
      .get(`/api/courses/${courseId}/modules`)
      .set("Cookie", teacherCookie)
      .expect(200);
    expect(Array.isArray(modList.body)).toBe(true);
    expect(modList.body.some((m: { id: string }) => m.id === moduleId)).toBe(
      true,
    );

    const modOne = await request(app.getHttpServer())
      .get(`/api/courses/${courseId}/modules/${moduleId}`)
      .set("Cookie", teacherCookie)
      .expect(200);
    expect(modOne.body.id).toBe(moduleId);

    await request(app.getHttpServer())
      .get(`/api/courses/${MISSING_ID}/modules`)
      .set("Cookie", teacherCookie)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/api/courses/${courseId}/modules/${MISSING_MODULE_ID}`)
      .set("Cookie", teacherCookie)
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/courses/${courseId}/modules/${moduleId}`)
      .set("Cookie", teacherCookie)
      .send({ title: "Module A updated" })
      .expect(200);

    const mat = await request(app.getHttpServer())
      .post(`/api/courses/${courseId}/modules/${moduleId}/materials`)
      .set("Cookie", teacherCookie)
      .send({
        type: "text",
        title: "Reading 1",
        content: { body: "Hallo" },
        order_index: 0,
      })
      .expect(201);
    const materialId = mat.body.id as string;

    const mats = await request(app.getHttpServer())
      .get(`/api/courses/${courseId}/modules/${moduleId}/materials`)
      .set("Cookie", teacherCookie)
      .expect(200);
    expect(Array.isArray(mats.body)).toBe(true);

    const matOne = await request(app.getHttpServer())
      .get(
        `/api/courses/${courseId}/modules/${moduleId}/materials/${materialId}`,
      )
      .set("Cookie", teacherCookie)
      .expect(200);
    expect(matOne.body.id).toBe(materialId);

    await request(app.getHttpServer())
      .get(
        `/api/courses/${MISSING_ID}/modules/${moduleId}/materials/${materialId}`,
      )
      .set("Cookie", teacherCookie)
      .expect(404);

    await request(app.getHttpServer())
      .get(
        `/api/courses/${courseId}/modules/${MISSING_MODULE_ID}/materials/${materialId}`,
      )
      .set("Cookie", teacherCookie)
      .expect(404);

    await request(app.getHttpServer())
      .get(
        `/api/courses/${courseId}/modules/${moduleId}/materials/${MISSING_MATERIAL_ID}`,
      )
      .set("Cookie", teacherCookie)
      .expect(404);

    await request(app.getHttpServer())
      .patch(
        `/api/courses/${courseId}/modules/${moduleId}/materials/${materialId}`,
      )
      .set("Cookie", teacherCookie)
      .send({ title: "Reading 1b" })
      .expect(200);

    await request(app.getHttpServer())
      .delete(
        `/api/courses/${courseId}/modules/${moduleId}/materials/${materialId}`,
      )
      .set("Cookie", teacherCookie)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/courses/${courseId}/modules/${moduleId}`)
      .set("Cookie", teacherCookie)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/courses/${draftId}`)
      .set("Cookie", teacherCookie)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/courses/${courseId}`)
      .set("Cookie", teacherCookie)
      .expect(200);
  });
});
