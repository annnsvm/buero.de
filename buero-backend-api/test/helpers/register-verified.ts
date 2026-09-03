import { INestApplication } from "@nestjs/common";
import request from "supertest";

export type RegisterPayload = {
  email: string;
  password: string;
  role: "student" | "teacher";
  language?: "en" | "de";
  name?: string;
};

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

export function cookieHeaderFromResponse(headers: {
  "set-cookie"?: string | string[];
}): string {
  return getSetCookieHeaders(headers)
    .map((c) => c.split(";")[0])
    .join("; ");
}

/** Start registration + verify email code (e2e returns verificationCode). */
export async function registerVerified(
  app: INestApplication,
  payload: RegisterPayload,
) {
  const started = await request(app.getHttpServer())
    .post("/api/auth/register")
    .send(payload)
    .expect(200);

  expect(started.body.status).toBe("verification_required");
  expect(started.body.verificationCode).toMatch(/^\d{6}$/);

  return request(app.getHttpServer())
    .post("/api/auth/verify-registration")
    .send({ email: payload.email, code: started.body.verificationCode })
    .expect(201);
}
