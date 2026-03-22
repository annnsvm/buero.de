import { ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";
import { CreateUserDto, LanguageEnum, RoleEnum } from "./dto/create-user.dto";

describe("UserService (auth-related)", () => {
  let service: UserService;
  let prisma: {
    user: { findFirst: jest.Mock; create: jest.Mock };
    studentProfile: { create: jest.Mock };
    teacherProfile: { create: jest.Mock };
    refreshToken: { create: jest.Mock; findFirst: jest.Mock; updateMany: jest.Mock };
  };
  let jwtService: jest.Mocked<Pick<JwtService, "sign" | "verify" | "decode">>;
  let configGet: jest.Mock;

  const accessSecret = "a".repeat(32);
  const refreshSecret = "b".repeat(32);

  beforeEach(async () => {
    configGet = jest.fn((key: string) => {
      const map: Record<string, string> = {
        JWT_ACCESS_SECRET: accessSecret,
        JWT_REFRESH_SECRET: refreshSecret,
        JWT_ACCESS_EXPIRES_IN: "30m",
        JWT_REFRESH_EXPIRES_IN: "7d",
      };
      return map[key];
    });

    prisma = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      studentProfile: { create: jest.fn() },
      teacherProfile: { create: jest.fn() },
      refreshToken: {
        create: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue("signed.jwt.token"),
      verify: jest.fn(),
      decode: jest.fn().mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    } as unknown as typeof jwtService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: { get: configGet } },
      ],
    }).compile();

    service = module.get(UserService);
  });

  describe("createUser", () => {
    const baseDto: CreateUserDto = {
      email: "new@example.com",
      password: "Password1x",
      role: RoleEnum.student,
      language: LanguageEnum.en,
    };

    it("throws ConflictException when email already exists", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({
        id: "existing",
        email: baseDto.email,
      });

      await expect(service.createUser(baseDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("creates student user and profile on success", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      const createdUser = {
        id: "user-uuid",
        email: baseDto.email.toLowerCase(),
        passwordHash: "hashed",
        role: "student",
        language: "en",
        deletedAt: null,
        stripeCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);
      (prisma.studentProfile.create as jest.Mock).mockResolvedValue({});

      const result = await service.createUser(baseDto);

      expect(result.email).toBe(baseDto.email.toLowerCase());
      expect(result).not.toHaveProperty("passwordHash");
      expect(prisma.studentProfile.create).toHaveBeenCalledWith({
        data: { userId: createdUser.id },
      });
      expect(prisma.teacherProfile.create).not.toHaveBeenCalled();
    });

    it("creates teacher user and profile on success", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      const dto = { ...baseDto, role: RoleEnum.teacher };
      const createdUser = {
        id: "teacher-uuid",
        email: dto.email.toLowerCase(),
        passwordHash: "hashed",
        role: "teacher",
        language: "en",
        deletedAt: null,
        stripeCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);
      (prisma.teacherProfile.create as jest.Mock).mockResolvedValue({});

      await service.createUser(dto);

      expect(prisma.teacherProfile.create).toHaveBeenCalledWith({
        data: { userId: createdUser.id },
      });
      expect(prisma.studentProfile.create).not.toHaveBeenCalled();
    });
  });

  describe("validatePassword + findUserByEmailWithPassword flow", () => {
    it("validatePassword returns true for correct password", async () => {
      const hash = await bcrypt.hash("CorrectPass1", 10);
      const ok = await service.validatePassword(
        { passwordHash: hash },
        "CorrectPass1",
      );
      expect(ok).toBe(true);
    });

    it("validatePassword returns false for wrong password", async () => {
      const hash = await bcrypt.hash("CorrectPass1", 10);
      const ok = await service.validatePassword(
        { passwordHash: hash },
        "WrongPass1x",
      );
      expect(ok).toBe(false);
    });
  });

  describe("signAccessToken", () => {
    it("calls jwt.sign with access secret", () => {
      service.signAccessToken("user-id");
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: "user-id" },
        expect.objectContaining({
          secret: accessSecret,
        }),
      );
    });
  });

  describe("findRefreshToken", () => {
    it("returns null when JWT verify fails", async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid signature");
      });

      const result = await service.findRefreshToken("bad.token");
      expect(result).toBeNull();
      expect(prisma.refreshToken.findFirst).not.toHaveBeenCalled();
    });

    it("returns null when no DB record", async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: "u1" });
      (prisma.refreshToken.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.findRefreshToken("valid.jwt");
      expect(result).toBeNull();
    });

    it("returns id and userId when token is valid and record exists", async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: "u1" });
      (prisma.refreshToken.findFirst as jest.Mock).mockResolvedValue({
        id: "rt-1",
        userId: "u1",
      });

      const result = await service.findRefreshToken("valid.jwt");
      expect(result).toEqual({ id: "rt-1", userId: "u1" });
    });
  });

  describe("revokeRefreshToken", () => {
    it("calls updateMany with revokedAt", async () => {
      (prisma.refreshToken.updateMany as jest.Mock).mockResolvedValue({
        count: 1,
      });

      await service.revokeRefreshToken("any.raw.token");

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          tokenHash: expect.any(String),
        }),
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe("createRefreshToken", () => {
    it("persists refresh token hash and returns raw token", async () => {
      (jwtService.sign as jest.Mock).mockReturnValue("raw.refresh.jwt");
      (jwtService.decode as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 86400,
      });
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});

      const token = await service.createRefreshToken("user-1");

      expect(token).toBe("raw.refresh.jwt");
      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-1",
          tokenHash: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
    });
  });
});
