import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync } from "fs";
import { join } from "path";
import nodemailer, { type Transporter } from "nodemailer";

const LOGO_CID = "buro-logo";

export type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  isTestMode(): boolean {
    return (
      this.config.get<string>("E2E_TEST") === "true" ||
      this.config.get<string>("NODE_ENV") === "test"
    );
  }

  getSiteUrl(): string {
    return (
      this.config.get<string>("PUBLIC_SITE_URL") ??
      this.config.get<string>("CORS_ORIGIN") ??
      "https://www.buro-de.com"
    ).replace(/\/$/, "");
  }

  resolveLogo(): { logoUrl: string; attachments: Array<Record<string, unknown>> } {
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
          logoUrl: `cid:${LOGO_CID}`,
          attachments: [
            {
              filename: "buro-logo.png",
              path,
              cid: LOGO_CID,
              contentType: path.endsWith(".webp") ? "image/webp" : "image/png",
              contentDisposition: "inline",
            },
          ],
        };
      }
    }

    this.logger.warn("Email logo file not found; falling back to MAIL_LOGO_URL");
    const siteUrl = this.getSiteUrl();
    return {
      logoUrl:
        this.config.get<string>("MAIL_LOGO_URL") ??
        `${siteUrl}/images/logo_light.webp`,
      attachments: [],
    };
  }

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

  async send(payload: MailPayload): Promise<void> {
    if (this.isTestMode()) {
      this.logger.debug(`Skipped email to ${payload.to} in test mode`);
      return;
    }

    const inbox =
      this.config.get<string>("CONTACT_INBOX") ??
      this.config.get<string>("SMTP_USER") ??
      "burode452@gmail.com";
    const from =
      this.config.get<string>("MAIL_FROM") ??
      `"Büro.de" <${this.config.get<string>("SMTP_USER") ?? inbox}>`;
    const { attachments } = this.resolveLogo();

    try {
      await this.getTransporter().sendMail({
        from,
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        attachments: attachments.length ? attachments : undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${payload.to}`, error);
      throw new ServiceUnavailableException(
        "Could not send email. Please try again later.",
      );
    }
  }
}
