import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";
import { registerVerified } from "./helpers/register-verified";

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

describe("Auth (e2e)", () => {
  let app: INestApplication;

  const email = () => `e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
  const password = "E2ePass123";

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

  it("POST /api/auth/register — 200 verification_required, no auth cookies", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: email(),
        password,
        role: "student",
        language: "en",
      })
      .expect(200);

    expect(res.body.status).toBe("verification_required");
    expect(res.body.verificationCode).toMatch(/^\d{6}$/);
    const cookies = getSetCookieHeaders(res.headers);
    expect(cookies.some((c) => c.startsWith("access_token="))).toBe(false);
  });

  it("POST /api/auth/verify-registration — 201 cookies after valid code, 400 after wrong code", async () => {
    const em = email();
    const started = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "student",
        language: "en",
      })
      .expect(200);

    await request(app.getHttpServer())
      .post("/api/auth/verify-registration")
      .send({ email: em, code: "000000" })
      .expect(400);

    const res = await request(app.getHttpServer())
      .post("/api/auth/verify-registration")
      .send({ email: em, code: started.body.verificationCode })
      .expect(201);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(em.toLowerCase());
    const cookies = getSetCookieHeaders(res.headers);
    expect(cookies.some((c) => c.startsWith("access_token="))).toBe(true);
    expect(cookies.some((c) => c.startsWith("refresh_token="))).toBe(true);
  });

  it("POST /api/auth/register — 409 duplicate email after verification", async () => {
    const em = email();
    await registerVerified(app, {
      email: em,
      password,
      role: "student",
      language: "en",
    });

    await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: em,
        password,
        role: "student",
        language: "en",
      })
      .expect(409);
  });

  it("POST /api/auth/login — 200 (cookies), 401 wrong password", async () => {
    const em = email();
    await registerVerified(app, {
      email: em,
      password,
      role: "student",
      language: "en",
    });

    const ok = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: em, password })
      .expect(200);

    const cookies = getSetCookieHeaders(ok.headers);
    expect(cookies.some((c) => c.startsWith("access_token="))).toBe(true);

    await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: em, password: "WrongPass999" })
      .expect(401);
  });

  it("POST /api/auth/refresh — 200 with refresh cookie, 401 without", async () => {
    const em = email();
    const reg = await registerVerified(app, {
      email: em,
      password,
      role: "student",
      language: "en",
    });

    const cookieHeader = getSetCookieHeaders(reg.headers)
      .map((c) => c.split(";")[0])
      .join("; ");

    const refresh = await request(app.getHttpServer())
      .post("/api/auth/refresh")
      .set("Cookie", cookieHeader)
      .expect(200);

    expect(refresh.body.user).toBeDefined();
    const newCookies = getSetCookieHeaders(refresh.headers);
    expect(newCookies.some((c) => c.startsWith("refresh_token="))).toBe(true);

    await request(app.getHttpServer())
      .post("/api/auth/refresh")
      .expect(401);
  });

  it("POST /api/auth/logout — 200, cookies cleared", async () => {
    const em = email();
    const reg = await registerVerified(app, {
      email: em,
      password,
      role: "student",
      language: "en",
    });

    const cookieHeader = getSetCookieHeaders(reg.headers)
      .map((c) => c.split(";")[0])
      .join("; ");

    const out = await request(app.getHttpServer())
      .post("/api/auth/logout")
      .set("Cookie", cookieHeader)
      .expect(200);

    const cleared = getSetCookieHeaders(out.headers);
    expect(cleared.length).toBeGreaterThan(0);
    expect(
      cleared.some((c) => c.includes("access_token=;") || c.includes("Max-Age=0")),
    ).toBe(true);
  });

  it("POST /api/auth/change-password — 401 wrong current, 200 then login with new password", async () => {
    const em = email();
    const reg = await registerVerified(app, {
      email: em,
      password,
      role: "student",
      language: "en",
    });

    const cookieHeader = getSetCookieHeaders(reg.headers)
      .map((c) => c.split(";")[0])
      .join("; ");

    await request(app.getHttpServer())
      .post("/api/auth/change-password")
      .set("Cookie", cookieHeader)
      .send({
        current_password: "WrongPass999",
        new_password: "NewE2ePass456",
      })
      .expect(401);

    const newPass = "NewE2ePass456";
    const changed = await request(app.getHttpServer())
      .post("/api/auth/change-password")
      .set("Cookie", cookieHeader)
      .send({
        current_password: password,
        new_password: newPass,
      })
      .expect(200);

    expect(changed.body.user).toBeDefined();
    expect(changed.body.user.email).toBe(em);
    const afterChangeCookies = getSetCookieHeaders(changed.headers);
    expect(afterChangeCookies.some((c) => c.startsWith("access_token="))).toBe(
      true,
    );

    await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: em, password })
      .expect(401);

    await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: em, password: newPass })
      .expect(200);
  });

  it("GET /api/users/me — 401 without JWT cookie", async () => {
    await request(app.getHttpServer()).get("/api/users/me").expect(401);
  });
});
