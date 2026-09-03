import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { createHash, randomInt } from "crypto";
import { Language, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { UserWithoutPassword } from "../user/types/user-response.type";
import { RegisterDto } from "./dto/register.dto";
import {
  buildVerificationEmail,
  buildWelcomeEmail,
} from "./auth-email.templates";

const SALT_ROUNDS = 10;
const CODE_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

export type StartRegistrationResult = {
  status: "verification_required";
  email: string;
  verificationCode?: string;
};

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  private hashCode(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }

  private emailLocale(locale?: string): "uk" | "en" {
    return locale === "uk" ? "uk" : "en";
  }

  private generateCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  private async createUserFromPending(pending: {
    email: string;
    name: string | null;
    passwordHash: string;
    role: Role;
    language: Language;
  }): Promise<UserWithoutPassword> {
    const existing = await this.prisma.user.findFirst({
      where: { email: pending.email, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    const user = await this.prisma.user.create({
      data: {
        email: pending.email,
        name: pending.name,
        passwordHash: pending.passwordHash,
        role: pending.role,
        language: pending.language || "en",
      },
    });
    if (pending.role === "student") {
      await this.prisma.studentProfile.create({ data: { userId: user.id } });
    } else {
      await this.prisma.teacherProfile.create({ data: { userId: user.id } });
    }
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async startRegistration(dto: RegisterDto): Promise<StartRegistrationResult> {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const code = this.generateCode();
    const locale = this.emailLocale(dto.locale ?? "en");
    const name =
      dto.name == null
        ? null
        : (typeof dto.name === "string" ? dto.name.trim() : "") || null;

    await this.prisma.pendingRegistration.upsert({
      where: { email },
      create: {
        email,
        name,
        passwordHash,
        role: dto.role as Role,
        language: (dto.language as Language) || "en",
        locale,
        codeHash: this.hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        attempts: 0,
      },
      update: {
        name,
        passwordHash,
        role: dto.role as Role,
        language: (dto.language as Language) || "en",
        locale,
        codeHash: this.hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        attempts: 0,
      },
    });

    await this.sendVerificationEmail(email, name, code, locale);

    const result: StartRegistrationResult = {
      status: "verification_required",
      email,
    };
    if (this.mailer.isTestMode()) {
      result.verificationCode = code;
    }
    return result;
  }

  async verifyRegistration(
    emailRaw: string,
    code: string,
  ): Promise<UserWithoutPassword> {
    const email = emailRaw.toLowerCase();
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { email },
    });
    if (!pending) {
      throw new BadRequestException("Invalid or expired verification code");
    }
    if (pending.expiresAt.getTime() < Date.now()) {
      await this.prisma.pendingRegistration.delete({ where: { email } });
      throw new BadRequestException("Verification code expired. Request a new one.");
    }

    const attempts = pending.attempts + 1;
    if (attempts > MAX_ATTEMPTS) {
      await this.prisma.pendingRegistration.delete({ where: { email } });
      throw new BadRequestException("Too many attempts. Request a new code.");
    }

    if (pending.codeHash !== this.hashCode(code)) {
      await this.prisma.pendingRegistration.update({
        where: { email },
        data: { attempts },
      });
      throw new BadRequestException("Invalid or expired verification code");
    }

    const user = await this.createUserFromPending(pending);

    await this.prisma.pendingRegistration.delete({ where: { email } });
    await this.sendWelcomeEmail(user.email, user.name, this.emailLocale(pending.locale));
    return user;
  }

  async resendCode(emailRaw: string): Promise<{ status: "verification_required"; email: string; verificationCode?: string }> {
    const email = emailRaw.toLowerCase();
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { email },
    });
    if (!pending) {
      throw new NotFoundException("No pending registration for this email");
    }

    const elapsed = Date.now() - pending.updatedAt.getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      throw new BadRequestException("Please wait before requesting a new code");
    }

    const code = this.generateCode();
    const locale = this.emailLocale(pending.locale);
    await this.prisma.pendingRegistration.update({
      where: { email },
      data: {
        codeHash: this.hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        attempts: 0,
      },
    });

    await this.sendVerificationEmail(email, pending.name, code, locale);

    const result: { status: "verification_required"; email: string; verificationCode?: string } = {
      status: "verification_required",
      email,
    };
    if (this.mailer.isTestMode()) {
      result.verificationCode = code;
    }
    return result;
  }

  private async sendVerificationEmail(
    email: string,
    name: string | null,
    code: string,
    locale: "uk" | "en",
  ): Promise<void> {
    const { logoUrl } = this.mailer.resolveLogo();
    const mail = buildVerificationEmail({
      name,
      code,
      locale,
      logoUrl,
      siteUrl: this.mailer.getSiteUrl(),
    });
    await this.mailer.send({
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
  }

  private async sendWelcomeEmail(
    email: string,
    name: string | null | undefined,
    locale: "uk" | "en",
  ): Promise<void> {
    const { logoUrl } = this.mailer.resolveLogo();
    const mail = buildWelcomeEmail({
      name,
      locale,
      logoUrl,
      siteUrl: this.mailer.getSiteUrl(),
    });
    try {
      await this.mailer.send({
        to: email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (error) {
      this.logger.error(`Welcome email failed for ${email}`, error);
    }
  }
}
