import { ConflictException, BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { RoleEnum, LanguageEnum } from "../user/dto/create-user.dto";
import { RegisterDto } from "./dto/register.dto";
import { RegistrationService } from "./registration.service";

describe("RegistrationService", () => {
  let service: RegistrationService;
  let prisma: {
    user: { findFirst: jest.Mock; create: jest.Mock };
    studentProfile: { create: jest.Mock };
    teacherProfile: { create: jest.Mock };
    pendingRegistration: {
      upsert: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let mailer: { send: jest.Mock; isTestMode: jest.Mock; resolveLogo: jest.Mock; getSiteUrl: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: { findFirst: jest.fn(), create: jest.fn() },
      studentProfile: { create: jest.fn() },
      teacherProfile: { create: jest.fn() },
      pendingRegistration: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    mailer = {
      send: jest.fn().mockResolvedValue(undefined),
      isTestMode: jest.fn().mockReturnValue(true),
      resolveLogo: jest.fn().mockReturnValue({ logoUrl: "cid:logo", attachments: [] }),
      getSiteUrl: jest.fn().mockReturnValue("https://www.buro-de.com"),
    };

    const module = await Test.createTestingModule({
      providers: [
        RegistrationService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailerService, useValue: mailer },
      ],
    }).compile();

    service = module.get(RegistrationService);
  });

  const dto: RegisterDto = Object.assign(new RegisterDto(), {
    email: "New@Example.com",
    name: "Anna",
    password: "Password1x",
    role: RoleEnum.student,
    language: LanguageEnum.en,
    locale: "uk",
  });

  it("startRegistration stores a pending row and returns a test code", async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.pendingRegistration.upsert.mockResolvedValue({});

    const result = await service.startRegistration(dto);

    expect(result.status).toBe("verification_required");
    expect(result.email).toBe("new@example.com");
    expect(result.verificationCode).toMatch(/^\d{6}$/);
    expect(prisma.pendingRegistration.upsert).toHaveBeenCalled();
    expect(mailer.send).toHaveBeenCalled();
  });

  it("startRegistration rejects an existing user", async () => {
    prisma.user.findFirst.mockResolvedValue({ id: "u1" });
    await expect(service.startRegistration(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it("verifyRegistration creates the user after a valid code", async () => {
    const code = "123456";
    const { createHash } = await import("crypto");
    prisma.pendingRegistration.findUnique.mockResolvedValue({
      email: "new@example.com",
      name: "Anna",
      passwordHash: "hash",
      role: "student",
      language: "en",
      locale: "uk",
      codeHash: createHash("sha256").update(code).digest("hex"),
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
    });
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "u1",
      email: "new@example.com",
      name: "Anna",
      passwordHash: "hash",
      role: "student",
      language: "en",
    });

    const user = await service.verifyRegistration("new@example.com", code);

    expect(user.email).toBe("new@example.com");
    expect(prisma.studentProfile.create).toHaveBeenCalled();
    expect(prisma.pendingRegistration.delete).toHaveBeenCalled();
    expect(mailer.send).toHaveBeenCalled();
  });

  it("verifyRegistration rejects a wrong code", async () => {
    prisma.pendingRegistration.findUnique.mockResolvedValue({
      email: "new@example.com",
      codeHash: "other",
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
    });

    await expect(service.verifyRegistration("new@example.com", "000000")).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.pendingRegistration.update).toHaveBeenCalled();
  });
});
