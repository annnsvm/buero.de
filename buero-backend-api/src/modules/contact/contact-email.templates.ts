type EmailCopy = {
  userSubject: string;
  userTitle: string;
  userBody: string;
  userNext: string;
  inboxSubject: string;
  footerTagline: string;
  privacy: string;
  terms: string;
  contactLabel: string;
  followLabel: string;
};

const COPY: Record<"uk" | "en", EmailCopy> = {
  uk: {
    userSubject: "Дякуємо за звернення — Büro.de",
    userTitle: "Дякуємо, що заповнили форму",
    userBody:
      "Ми отримали вашу заявку. Найближчим часом вона буде розглянута, і ми звʼяжемося з вами на цю email-адресу.",
    userNext:
      "Якщо питання термінове — напишіть нам напряму на burode452@gmail.com.",
    inboxSubject: "Нова заявка з форми звʼязку",
    footerTagline: "Вивчай німецьку. Живи по-німецьки.",
    privacy: "Політика конфіденційності",
    terms: "Умови використання",
    contactLabel: "Контакт",
    followLabel: "Ми в соцмережах",
  },
  en: {
    userSubject: "Thank you for contacting Büro.de",
    userTitle: "Thanks for submitting the form",
    userBody:
      "We received your request. Our team will review it shortly and get back to you at this email address.",
    userNext: "For urgent questions, email us directly at burode452@gmail.com.",
    inboxSubject: "New contact form submission",
    footerTagline: "Learn German. Live German.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contactLabel: "Contact",
    followLabel: "Follow us",
  },
};

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
  copy: EmailCopy;
  siteUrl: string;
  year: number;
}): string {
  const { logoUrl, title, bodyHtml, copy, siteUrl, year } = opts;
  const privacyUrl = `${siteUrl}/privacy`;
  const termsUrl = `${siteUrl}/terms`;
  const instagramUrl = "https://www.instagram.com/buro.de.german/";

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.soft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.soft};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.white};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.border};">
          <tr>
            <td style="background:${BRAND.white};padding:28px 32px;text-align:center;border-bottom:3px solid ${BRAND.coral};">
              <img src="${escapeHtml(logoUrl)}" alt="Büro.de" width="140" height="56" style="display:inline-block;height:56px;width:auto;max-width:180px;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;text-align:left;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${BRAND.ink};font-weight:700;">${escapeHtml(title)}</h1>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.soft};border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font-size:13px;line-height:1.55;color:${BRAND.muted};">
                    <strong style="color:${BRAND.ink};">${escapeHtml(copy.contactLabel)}</strong><br />
                    <a href="mailto:burode452@gmail.com" style="color:${BRAND.coralDark};text-decoration:none;">burode452@gmail.com</a><br /><br />
                    <strong style="color:${BRAND.ink};">${escapeHtml(copy.followLabel)}</strong><br />
                    <a href="${instagramUrl}" style="color:${BRAND.coralDark};text-decoration:none;">Instagram</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center;">
              <p style="margin:0 0 8px;">${escapeHtml(copy.footerTagline)}</p>
              <p style="margin:0 0 8px;">
                <a href="${privacyUrl}" style="color:${BRAND.muted};">${escapeHtml(copy.privacy)}</a>
                &nbsp;·&nbsp;
                <a href="${termsUrl}" style="color:${BRAND.muted};">${escapeHtml(copy.terms)}</a>
              </p>
              <p style="margin:0;">© ${year} Büro.de. All rights reserved.</p>
              <p style="margin:10px 0 0;font-size:11px;color:#9A948E;">
                You received this email because you submitted a form on Büro.de.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildUserConfirmationEmail(opts: {
  name: string;
  language: "uk" | "en";
  logoUrl: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const copy = COPY[opts.language];
  const safeName = escapeHtml(opts.name.trim() || (opts.language === "uk" ? "друже" : "there"));
  const greeting =
    opts.language === "uk" ? `Вітаємо, ${safeName}!` : `Hi ${safeName},`;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">${greeting}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">${escapeHtml(copy.userBody)}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${escapeHtml(copy.userNext)}</p>
  `;

  const html = layout({
    logoUrl: opts.logoUrl,
    title: copy.userTitle,
    bodyHtml,
    copy,
    siteUrl: opts.siteUrl,
    year: new Date().getFullYear(),
  });

  const text = [
    copy.userTitle,
    "",
    opts.language === "uk" ? `Вітаємо, ${opts.name}!` : `Hi ${opts.name},`,
    copy.userBody,
    copy.userNext,
    "",
    "burode452@gmail.com",
    "https://www.instagram.com/buro.de.german/",
    opts.siteUrl,
  ].join("\n");

  return { subject: copy.userSubject, html, text };
}

export function buildInboxNotificationEmail(opts: {
  name: string;
  email: string;
  message: string;
  subject?: string;
  language: "uk" | "en";
  logoUrl: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const copy = COPY[opts.language];
  const topic = opts.subject?.trim() || (opts.language === "uk" ? "Звʼязок" : "Contact");

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      <strong>Тема:</strong> ${escapeHtml(topic)}
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      <strong>Імʼя:</strong> ${escapeHtml(opts.name)}
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      <strong>Email:</strong> <a href="mailto:${escapeHtml(opts.email)}" style="color:${BRAND.coralDark};">${escapeHtml(opts.email)}</a>
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${BRAND.ink};">Повідомлення</p>
    <p style="margin:0;padding:14px 16px;background:${BRAND.soft};border-radius:12px;font-size:15px;line-height:1.6;color:${BRAND.ink};white-space:pre-wrap;">${escapeHtml(opts.message)}</p>
  `;

  const html = layout({
    logoUrl: opts.logoUrl,
    title: copy.inboxSubject,
    bodyHtml,
    copy,
    siteUrl: opts.siteUrl,
    year: new Date().getFullYear(),
  });

  const text = [
    copy.inboxSubject,
    `Subject: ${topic}`,
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    "",
    opts.message,
  ].join("\n");

  return {
    subject: `${copy.inboxSubject}: ${opts.name}`,
    html,
    text,
  };
}
