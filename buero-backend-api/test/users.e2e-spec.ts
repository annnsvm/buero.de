import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

describe("Users /me (e2e)", () => {
  let app: INestApplication;

  const email = () =>
    `users_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
  const password = "UsersE2ePass1";

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

  it("GET /api/users/me — 401 без cookie", async () => {
    await request(app.getHttpServer()).get("/api/users/me").expect(401);
  });

  it("GET /api/users/me — 200 з user/profile, без password_hash", async () => {
    const em = email();
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "student",
        language: "en",
      })
      .expect(201);

    const cookieHeader = getSetCookieHeaders(reg.headers)
      .map((c) => c.split(";")[0])
      .join("; ");

    const res = await request(app.getHttpServer())
      .get("/api/users/me")
      .set("Cookie", cookieHeader)
      .expect(200);

    const body = JSON.stringify(res.body);
    expect(body.toLowerCase()).not.toContain("password_hash");
    expect(body).not.toContain("passwordHash");
    expect(res.body.user).toBeDefined();
    expect(res.body.profile).toBeDefined();
    expect(res.body.user.email).toBe(em.toLowerCase());
  });

  it("PATCH /api/users/me — 200 з валідним cookie, тіло без пароля", async () => {
    const em = email();
    const reg = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "student",
        language: "en",
      })
      .expect(201);

    const cookieHeader = getSetCookieHeaders(reg.headers)
      .map((c) => c.split(";")[0])
      .join("; ");

    const patch = await request(app.getHttpServer())
      .patch("/api/users/me")
      .set("Cookie", cookieHeader)
      .send({ timezone: "Europe/Vienna" })
      .expect(200);

    const body = JSON.stringify(patch.body);
    expect(body.toLowerCase()).not.toContain("password_hash");
    expect(body).not.toContain("passwordHash");
    expect(patch.body.user).toBeDefined();
    expect(patch.body.profile).toBeDefined();
    expect(patch.body.profile.timezone).toBe("Europe/Vienna");
  });
});
