import { describe, expect, it } from 'vitest';
import { applyPageMeta } from '@/seo/applyPageMeta';
import { PUBLIC_PAGES } from '@/seo/publicPages';

const homeTemplate = `<!doctype html>
<html lang="uk">
  <head>
    <title>Büro.de — Вивчай німецьку. Живи німецькою.</title>
    <meta name="description" content="Мовні та інтеграційні курси — щоб говорити німецькою й знати, де й як її застосовувати в житті в Німеччині." />
    <link rel="canonical" href="https://buro-de.com/" />
    <meta property="og:url" content="https://buro-de.com/" />
    <meta property="og:title" content="Büro.de — Вивчай німецьку. Живи німецькою." />
    <meta property="og:description" content="Мовні та інтеграційні курси — щоб говорити німецькою й знати, де й як її застосовувати в житті в Німеччині." />
    <meta name="twitter:title" content="Büro.de — Вивчай німецьку. Живи німецькою." />
    <meta name="twitter:description" content="Мовні та інтеграційні курси — щоб говорити німецькою й знати, де й як її застосовувати в житті в Німеччині." />
  </head>
  <body></body>
</html>`;

describe('applyPageMeta', () => {
  it('rewrites title, description and canonical for a public page', () => {
    const privacy = PUBLIC_PAGES.find((page) => page.path === '/privacy');
    if (!privacy) {
      throw new Error('privacy page is missing from PUBLIC_PAGES');
    }

    const html = applyPageMeta(homeTemplate, privacy);

    expect(html).toContain('<title>Політика конфіденційності | Büro.de</title>');
    expect(html).toContain('content="Як Büro.de збирає, використовує та захищає персональні дані."');
    expect(html).toContain('href="https://buro-de.com/privacy"');
    expect(html).toContain('content="https://buro-de.com/privacy"');
  });
});
