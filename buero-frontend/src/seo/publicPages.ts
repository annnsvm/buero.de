export const SITE_URL = 'https://buro-de.com';
export const SITE_NAME = 'Büro.de';

export const DEFAULT_TITLE = 'Büro.de - Вивчай німецьку. Живи німецькою.';
export const DEFAULT_DESCRIPTION =
  'Мовні та інтеграційні курси - щоб говорити німецькою й знати, де й як її застосовувати в житті в Німеччині.';

export type PublicPage = {
  path: string;
  file: string;
  title: string;
  description: string;
  preloadImage?: {
    href: string;
    srcSet?: string;
    sizes?: string;
  };
};

export const PUBLIC_PAGES: readonly PublicPage[] = [
  {
    path: '/',
    file: 'index.html',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    preloadImage: {
      href: '/images/home/hero.webp',
      srcSet: '/images/home/hero-800.webp 800w, /images/home/hero.webp 1600w',
      sizes: '100vw',
    },
  },
  {
    path: '/courses',
    file: 'courses/index.html',
    title: 'Курси | Büro.de',
    description:
      'Мовні курси, інтеграційні гіди та культурні матеріали. Почни з безкоштовного модуля або одразу обирай курс.',
    preloadImage: {
      href: '/images/courses/choose.webp',
      srcSet: '/images/courses/choose-800.webp 800w, /images/courses/choose.webp 1920w',
      sizes: '100vw',
    },
  },
  {
    path: '/privacy',
    file: 'privacy/index.html',
    title: 'Політика конфіденційності | Büro.de',
    description: 'Як Büro.de збирає, використовує та захищає персональні дані.',
  },
  {
    path: '/terms',
    file: 'terms/index.html',
    title: 'Умови використання | Büro.de',
    description: 'Умови користування платформою вивчення німецької Büro.de.',
  },
  {
    path: '/cookies',
    file: 'cookies/index.html',
    title: 'Політика Cookie | Büro.de',
    description: 'Як Büro.de використовує cookies та подібні технології.',
  },
];

export const absoluteUrl = (path: string): string =>
  path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
