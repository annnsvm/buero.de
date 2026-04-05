import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { createHash } from "crypto";
import type { StringValue } from "ms";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UserWithoutPassword } from "./types/user-response.type";
import { Language, Role } from "src/generated/prisma/enums";
import { User } from "src/generated/prisma/client";

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  signAccessToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: (this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") ??
          "30m") as StringValue,
      }
    );
  }

  async createRefreshToken(userId: string): Promise<string> {
    const expiresIn = (this.configService.get<string>(
      "JWT_REFRESH_EXPIRES_IN"
    ) ?? "30m") as StringValue;
    const secret = this.configService.get<string>("JWT_REFRESH_SECRET");
    const token = this.jwtService.sign(
      { sub: userId },
      {
        secret,
        expiresIn,
      }
    );
    const tokenHash = this.hashToken(token);
    const decoded = this.jwtService.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
    return token;
  }

  async findRefreshToken(
    token: string
  ): Promise<{ id: string; userId: string } | null> {
    const secret = this.configService.get<string>("JWT_REFRESH_SECRET");
    try {
      this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
    });
    return record ? { id: record.id, userId: record.userId } : null;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  }

  toUserWithoutPassword(user: {
    passwordHash: string;
    [key: string]: unknown;
  }): UserWithoutPassword {
    const { passwordHash: _, ...rest } = user;
    return rest as UserWithoutPassword;
  }

  async createUser(dto: CreateUserDto): Promise<UserWithoutPassword> {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException("User with this email already exists");
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const role = dto.role as Role;
    const language = dto.language as Language;

    const name =
      dto.name == null
        ? null
        : (typeof dto.name === "string" ? dto.name.trim() : "") || null;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name,
        passwordHash,
        role,
        language: language || "en",
      },
    });
    if (role === "student") {
      await this.prisma.studentProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else {
      await this.prisma.teacherProfile.create({
        data: {
          userId: user.id,
        },
      });
    }
    return this.toUserWithoutPassword(user);
  }

  async findUserByEmail(email: string): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: email, deletedAt: null },
    });
    return user ? this.toUserWithoutPassword(user) : null;
  }

  async findUserById(id: string): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return user ? this.toUserWithoutPassword(user) : null;
  }

  async validatePassword(
    user: { passwordHash: string },
    plainPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.passwordHash);
  }

  async getProfile(userId: string): Promise<{
    user: UserWithoutPassword;
    profile: Record<string, unknown>;
  } | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });
    if (!user) return null;

    const { studentProfile, teacherProfile, ...userRest } = user;
    const profile = user.role === "student" ? studentProfile : teacherProfile;
    if (!profile) return null;

    return {
      user: this.toUserWithoutPassword(userRest),
      profile: profile as Record<string, unknown>,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto
  ): Promise<{
    user: UserWithoutPassword;
    profile: Record<string, unknown>;
  } | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { studentProfile: true, teacherProfile: true },
    });
    if (!user) return null;
    if (dto.name !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: dto.name.trim() || null },
      });
    }
    if (user.role === "student") {
      if (dto.timezone !== undefined) {
        await this.prisma.studentProfile.updateMany({
          where: { userId },
          data: { timezone: dto.timezone },
        });
      }
      if (dto.language !== undefined) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { language: dto.language as Language },
        });
      }
    } else {
      if (dto.bio !== undefined) {
        await this.prisma.teacherProfile.updateMany({
          where: { userId },
          data: { bio: dto.bio },
        });
      }
      if (dto.isActive !== undefined) {
        await this.prisma.teacherProfile.updateMany({
          where: { userId },
          data: { isActive: dto.isActive },
        });
      }
      if (dto.language !== undefined) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { language: dto.language as Language },
        });
      }
    }
    return this.getProfile(userId);
  }

  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: email, deletedAt: null },
    });
    if (!user) return null;
    return user;
  }

  async findUserByIdWithPassword(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Зміна пароля: перевірка поточного, оновлення хешу, відкликання всіх refresh-токенів.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.findUserByIdWithPassword(userId);
    if (!user) throw new NotFoundException("User not found");
    const valid = await this.validatePassword(user, currentPassword);
    if (!valid) {
      throw new UnauthorizedException("Invalid current password");
    }
    const same = await bcrypt.compare(newPassword, user.passwordHash);
    if (same) {
      throw new BadRequestException(
        "New password must be different from the current password",
      );
    }
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    const updated = await this.findUserById(userId);
    if (!updated) throw new NotFoundException("User not found");
    return updated;
  }
}
