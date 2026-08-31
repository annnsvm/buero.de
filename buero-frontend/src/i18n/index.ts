import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk/translation.json';
import en from './locales/en/translation.json';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type AppLocale, SUPPORTED_LOCALES } from './constants';

const normalizeLocale = (value: string | null | undefined): AppLocale | null => {
  if (!value) return null;
  const base = value.toLowerCase().split('-')[0];
  if (SUPPORTED_LOCALES.includes(base as AppLocale)) {
    return base as AppLocale;
  }
  return null;
};

const readSavedLocale = (): AppLocale => {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LOCALE;
  }

  try {
    return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY)) ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
};

const initialLocale = readSavedLocale();

export const i18nReady = i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: [...SUPPORTED_LOCALES],
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLocale;
}

export default i18n;
