export const LOCALE_STORAGE_KEY = 'buero-locale';

export const SUPPORTED_LOCALES = ['uk', 'en'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'uk';

export const LOCALE_LABELS: Record<AppLocale, string> = {
  uk: 'UA',
  en: 'EN',
};
