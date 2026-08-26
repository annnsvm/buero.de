import { absoluteUrl, type PublicPage } from './publicPages';

const escapeAttr = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

const replaceOnce = (html: string, pattern: RegExp, replacement: string): string => {
  pattern.lastIndex = 0;
  if (!pattern.test(html)) {
    throw new Error(`applyPageMeta: no match for ${pattern}`);
  }

  pattern.lastIndex = 0;
  return html.replace(pattern, replacement);
};

export const applyPageMeta = (html: string, page: PublicPage): string => {
  const url = absoluteUrl(page.path);
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);

  const replacements: Array<[RegExp, string]> = [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`],
    [
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />`,
    ],
    [/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`],
    [/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`],
    [/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`],
    [
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${description}" />`,
    ],
    [/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`],
    [
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${description}" />`,
    ],
  ];

  return replacements.reduce((result, [pattern, replacement]) => replaceOnce(result, pattern, replacement), html);
};
