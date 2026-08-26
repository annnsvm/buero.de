import { describe, expect, it } from 'vitest';
import { applyPageMeta } from '@/seo/applyPageMeta';
import { PUBLIC_PAGES } from '@/seo/publicPages';

const homeTemplate = `<!doctype html>
<html lang="uk">
  <head>
    <title>Büro.de - Learn German. Live German.</title>
    <meta name="description" content="Language courses and integration guides — so you can speak German and know how to use it in everyday life in Germany." />
    <link rel="canonical" href="https://buro-de.com/" />
    <meta property="og:url" content="https://buro-de.com/" />
    <meta property="og:title" content="Büro.de - Learn German. Live German." />
    <meta property="og:description" content="Language courses and integration guides — so you can speak German and know how to use it in everyday life in Germany." />
    <meta name="twitter:title" content="Büro.de - Learn German. Live German." />
    <meta name="twitter:description" content="Language courses and integration guides — so you can speak German and know how to use it in everyday life in Germany." />
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

    expect(html).toContain('<title>Privacy Policy | Büro.de</title>');
    expect(html).toContain('content="How Büro.de collects, uses, and protects personal data."');
    expect(html).toContain('href="https://buro-de.com/privacy"');
    expect(html).toContain('content="https://buro-de.com/privacy"');
  });
});
