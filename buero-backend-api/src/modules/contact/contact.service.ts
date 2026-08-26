import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync } from "fs";
import { join } from "path";
import nodemailer, { type Transporter } from "nodemailer";
import {
  buildInboxNotificationEmail,
  buildUserConfirmationEmail,
} from "./contact-email.templates";
import type { CreateContactDto } from "./dto/create-contact.dto";

const LOGO_CID = "buro-logo";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;

    const host = this.config.get<string>("SMTP_HOST") ?? "smtp.gmail.com";
    const port = Number(this.config.get("SMTP_PORT") ?? 587);
    const user = this.config.get<string>("SMTP_USER");
    const pass = this.config.get<string>("SMTP_PASS");

    if (!user || !pass) {
      throw new ServiceUnavailableException(
        "Email is not configured. Set SMTP_USER and SMTP_PASS.",
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    return this.transporter;
  }

  /** Prefer embedded project logo (works offline / without public URL). */
  private resolveLogoAttachment():
    | { path: string; cid: string; filename: string; contentType: string }
    | null {
    const candidates = [
      join(process.cwd(), "assets/email/logo-dark.png"),
      join(__dirname, "../../../assets/email/logo-dark.png"),
      join(process.cwd(), "assets/email/logo.png"),
      join(__dirname, "../../../assets/email/logo.png"),
      join(process.cwd(), "../buero-frontend/public/images/logo_dark.webp"),
    ];

    for (const path of candidates) {
      if (existsSync(path)) {
        return {
          path,
          cid: LOGO_CID,
          filename: "buro-logo.png",
          contentType: path.endsWith(".webp") ? "image/webp" : "image/png",
        };
      }
    }

    this.logger.warn("Email logo file not found; falling back to MAIL_LOGO_URL");
    return null;
  }

  async submit(dto: CreateContactDto): Promise<{ ok: true }> {
    const language = dto.language ?? "uk";
    const inbox =
      this.config.get<string>("CONTACT_INBOX") ??
      this.config.get<string>("SMTP_USER") ??
      "burode452@gmail.com";
    const from =
      this.config.get<string>("MAIL_FROM") ??
      `"Büro.de" <${this.config.get<string>("SMTP_USER") ?? inbox}>`;
    const siteUrl = (
      this.config.get<string>("PUBLIC_SITE_URL") ??
      this.config.get<string>("CORS_ORIGIN") ??
      "https://www.buro-de.com"
    ).replace(/\/$/, "");

    const logoAttachment = this.resolveLogoAttachment();
    const logoUrl = logoAttachment
      ? `cid:${LOGO_CID}`
      : (this.config.get<string>("MAIL_LOGO_URL") ??
        `${siteUrl}/images/logo_light.webp`);

    const transporter = this.getTransporter();

    const userMail = buildUserConfirmationEmail({
      name: dto.name,
      language,
      logoUrl,
      siteUrl,
    });
    const inboxMail = buildInboxNotificationEmail({
      name: dto.name,
      email: dto.email,
      message: dto.message,
      subject: dto.subject,
      language,
      logoUrl,
      siteUrl,
    });

    const attachments = logoAttachment
      ? [
          {
            filename: logoAttachment.filename,
            path: logoAttachment.path,
            cid: logoAttachment.cid,
            contentType: logoAttachment.contentType,
            contentDisposition: "inline" as const,
          },
        ]
      : [];

    try {
      await Promise.all([
        transporter.sendMail({
          from,
          to: inbox,
          replyTo: dto.email,
          subject: inboxMail.subject,
          text: inboxMail.text,
          html: inboxMail.html,
          attachments,
        }),
        transporter.sendMail({
          from,
          to: dto.email,
          subject: userMail.subject,
          text: userMail.text,
          html: userMail.html,
          attachments,
        }),
      ]);
    } catch (error) {
      this.logger.error("Failed to send contact emails", error);
      throw new ServiceUnavailableException(
        "Could not send email. Please try again later.",
      );
    }

    return { ok: true };
  }
}
