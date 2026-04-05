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

describe("Courses (e2e)", () => {
  let app: INestApplication;

  const email = () =>
    `courses_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
  const password = "CoursesE2ePass1";

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "E2E: DATABASE_URL не задано. Вкажи .env з робочою PostgreSQL.",
      );
    }
    app = await createE2eApp();
  });

  afterAll(async () => {
    const prisma = app.get(PrismaService);
    await prisma.$disconnect();
    await app.close();
  });

  it("GET /api/courses — лише опубліковані курси", async () => {
    const em = email();
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "teacher",
        language: "en",
      })
      .expect(201);

    const cookie = cookieHeaderFromRegister(reg.headers);

    const createRes = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", cookie)
      .send({
        title: "E2E Draft Course",
        language: "de",
        is_published: false,
      })
      .expect(201);

    const draftId = createRes.body.id as string;

    const listBefore = await request(app.getHttpServer())
      .get("/api/courses")
      .expect(200);

    expect(Array.isArray(listBefore.body)).toBe(true);
    expect(
      listBefore.body.some((c: { id: string }) => c.id === draftId),
    ).toBe(false);

    await request(app.getHttpServer())
      .patch(`/api/courses/${draftId}`)
      .set("Cookie", cookie)
      .send({ is_published: true })
      .expect(200);

    const listAfter = await request(app.getHttpServer())
      .get("/api/courses")
      .expect(200);

    const found = listAfter.body.find((c: { id: string }) => c.id === draftId);
    expect(found).toBeDefined();
    expect(found.isPublished).toBe(true);
  });

  it("GET /api/courses/:id — 200 з JWT; 404 для неіснуючого id", async () => {
    const em = email();
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "teacher",
        language: "en",
      })
      .expect(201);

    const cookie = cookieHeaderFromRegister(reg.headers);

    const created = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", cookie)
      .send({
        title: "E2E One Course",
        language: "de",
        is_published: true,
      })
      .expect(201);

    const id = created.body.id as string;

    const getOk = await request(app.getHttpServer())
      .get(`/api/courses/${id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(getOk.body.id).toBe(id);
    expect(Array.isArray(getOk.body.modules)).toBe(true);

    const missingId = "00000000-0000-0000-0000-00000000abcd";
    await request(app.getHttpServer())
      .get(`/api/courses/${missingId}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("POST / PATCH / DELETE — вчитель; 404 при видаленні неіснуючого", async () => {
    const em = email();
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "teacher",
        language: "en",
      })
      .expect(201);

    const cookie = cookieHeaderFromRegister(reg.headers);

    const post = await request(app.getHttpServer())
      .post("/api/courses")
      .set("Cookie", cookie)
      .send({
        title: "CRUD Course",
        language: "de",
        description: "d",
        is_published: false,
      })
      .expect(201);

    const id = post.body.id as string;

    const patch = await request(app.getHttpServer())
      .patch(`/api/courses/${id}`)
      .set("Cookie", cookie)
      .send({ title: "CRUD Course Updated" })
      .expect(200);

    expect(patch.body.title).toBe("CRUD Course Updated");

    const del = await request(app.getHttpServer())
      .delete(`/api/courses/${id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(del.body).toMatchObject({ deleted: true, id });

    await request(app.getHttpServer())
      .delete(`/api/courses/${id}`)
      .set("Cookie", cookie)
      .expect(404);
  });
});
