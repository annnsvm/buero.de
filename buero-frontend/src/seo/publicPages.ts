export const SITE_URL = 'https://buro-de.com';
export const SITE_NAME = 'Büro.de';

export const DEFAULT_TITLE = 'Büro.de - Learn German. Live German.';
export const DEFAULT_DESCRIPTION =
  'Language courses and integration guides — so you can speak German and know how to use it in everyday life in Germany.';

export type PublicPage = {
  path: string;
  file: string;
  title: string;
  description: string;
};

export const PUBLIC_PAGES: readonly PublicPage[] = [
  {
    path: '/',
    file: 'index.html',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  {
    path: '/courses',
    file: 'courses/index.html',
    title: 'Courses | Büro.de',
    description:
      'Language courses, integration guides, and cultural deep-dives. Start with a free trial or dive right in.',
  },
  {
    path: '/privacy',
    file: 'privacy/index.html',
    title: 'Privacy Policy | Büro.de',
    description: 'How Büro.de collects, uses, and protects personal data.',
  },
  {
    path: '/terms',
    file: 'terms/index.html',
    title: 'Terms of Service | Büro.de',
    description: 'Terms for using the Büro.de German learning platform.',
  },
  {
    path: '/cookies',
    file: 'cookies/index.html',
    title: 'Cookie Policy | Büro.de',
    description: 'How Büro.de uses cookies and similar technologies.',
  },
];

export const absoluteUrl = (path: string): string =>
  path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
