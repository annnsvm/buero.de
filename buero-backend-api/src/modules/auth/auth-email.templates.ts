type EmailLocale = "uk" | "en";

const BRAND = {
  coral: "#E76E50",
  coralDark: "#C4553A",
  ink: "#1A1918",
  muted: "#6B6560",
  soft: "#F7F3F0",
  white: "#FFFFFF",
  border: "#E8E2DC",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(opts: {
  logoUrl: string;
  title: string;
  bodyHtml: string;
  siteUrl: string;
  footerNote: string;
  locale: EmailLocale;
}): string {
  const privacy = opts.locale === "uk" ? "Політика конфіденційності" : "Privacy Policy";
  const terms = opts.locale === "uk" ? "Умови використання" : "Terms of Service";
  const tagline =
    opts.locale === "uk"
      ? "Вивчай німецьку. Живи по-німецьки."
      : "Learn German. Live German.";
  const contactLabel = opts.locale === "uk" ? "Контакт" : "Contact";
  const followLabel = opts.locale === "uk" ? "Ми в соцмережах" : "Follow us";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="${opts.locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.soft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.soft};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.white};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.border};">
          <tr>
            <td style="background:${BRAND.white};padding:28px 32px;text-align:center;border-bottom:3px solid ${BRAND.coral};">
              <img src="${escapeHtml(opts.logoUrl)}" alt="Büro.de" width="140" height="56" style="display:inline-block;height:56px;width:auto;max-width:180px;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;text-align:left;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${BRAND.ink};font-weight:700;">${escapeHtml(opts.title)}</h1>
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.soft};border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font-size:13px;line-height:1.55;color:${BRAND.muted};">
                    <strong style="color:${BRAND.ink};">${escapeHtml(contactLabel)}</strong><br />
                    <a href="mailto:burode452@gmail.com" style="color:${BRAND.coralDark};text-decoration:none;">burode452@gmail.com</a><br /><br />
                    <strong style="color:${BRAND.ink};">${escapeHtml(followLabel)}</strong><br />
                    <a href="https://www.instagram.com/buro.de.german/" style="color:${BRAND.coralDark};text-decoration:none;">Instagram</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center;">
              <p style="margin:0 0 8px;">${escapeHtml(tagline)}</p>
              <p style="margin:0 0 8px;">
                <a href="${opts.siteUrl}/privacy" style="color:${BRAND.muted};">${escapeHtml(privacy)}</a>
                &nbsp;·&nbsp;
                <a href="${opts.siteUrl}/terms" style="color:${BRAND.muted};">${escapeHtml(terms)}</a>
              </p>
              <p style="margin:0;">© ${year} Büro.de. All rights reserved.</p>
              <p style="margin:10px 0 0;font-size:11px;color:#9A948E;">${escapeHtml(opts.footerNote)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function greetingName(name: string | null | undefined, locale: EmailLocale): string {
  const trimmed = name?.trim();
  if (trimmed) return trimmed;
  return locale === "uk" ? "друже" : "there";
}

export function buildVerificationEmail(opts: {
  name?: string | null;
  code: string;
  locale: EmailLocale;
  logoUrl: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const locale = opts.locale;
  const name = greetingName(opts.name, locale);
  const title =
    locale === "uk" ? "Підтвердь свою email-адресу" : "Confirm your email address";
  const subject =
    locale === "uk" ? "Код підтвердження — Büro.de" : "Your Büro.de verification code";
  const intro =
    locale === "uk"
      ? `Привіт, ${name}! Щоб завершити реєстрацію на Büro.de, введи цей код:`
      : `Hi ${name}! To finish creating your Büro.de account, enter this code:`;
  const valid =
    locale === "uk"
      ? "Код дійсний 15 хвилин. Якщо ти не реєструвався — просто ігноруй цей лист."
      : "This code is valid for 15 minutes. If you did not try to sign up, ignore this email.";
  const footerNote =
    locale === "uk"
      ? "Ти отримав цей лист, бо хтось почав реєстрацію на Büro.de з цією адресою."
      : "You received this email because someone started a Büro.de registration with this address.";

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">${escapeHtml(intro)}</p>
    <p style="margin:16px 0;padding:16px 18px;background:${BRAND.soft};border-radius:12px;text-align:center;font-size:32px;letter-spacing:0.28em;font-weight:700;color:${BRAND.ink};">${escapeHtml(opts.code)}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${escapeHtml(valid)}</p>
  `;

  return {
    subject,
    html: layout({
      logoUrl: opts.logoUrl,
      title,
      bodyHtml,
      siteUrl: opts.siteUrl,
      footerNote,
      locale,
    }),
    text: [title, "", intro, opts.code, "", valid].join("\n"),
  };
}

export function buildWelcomeEmail(opts: {
  name?: string | null;
  locale: EmailLocale;
  logoUrl: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const locale = opts.locale;
  const name = greetingName(opts.name, locale);
  const title = locale === "uk" ? "Вітаємо в Büro.de" : "Welcome to Büro.de";
  const subject =
    locale === "uk"
      ? "Вітаємо! Ти з нами на Büro.de"
      : "Welcome — you have joined Büro.de";
  const hello = locale === "uk" ? `Привіт, ${name}!` : `Hi ${name}!`;
  const body =
    locale === "uk"
      ? "Реєстрацію підтверджено. Раді, що ти приєднався до платформи — тепер можна обирати курс і починати вчитися німецьку."
      : "Your registration is confirmed. Welcome to the platform — you can now pick a course and start learning German.";
  const next =
    locale === "uk"
      ? "Заходь на сайт, коли буде зручно, і продовжуй з того місця, де зупинився."
      : "Come back whenever you are ready and continue from where you left off.";
  const footerNote =
    locale === "uk"
      ? "Ти отримав цей лист, бо щойно створив обліковий запис на Büro.de."
      : "You received this email because you just created a Büro.de account.";

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">${escapeHtml(hello)}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">${escapeHtml(body)}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${escapeHtml(next)}</p>
  `;

  return {
    subject,
    html: layout({
      logoUrl: opts.logoUrl,
      title,
      bodyHtml,
      siteUrl: opts.siteUrl,
      footerNote,
      locale,
    }),
    text: [title, "", hello, body, next].join("\n"),
  };
}
