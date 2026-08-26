import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk/translation.json';
import en from './locales/en/translation.json';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type AppLocale, SUPPORTED_LOCALES } from './constants';

const readSavedLocale = (): AppLocale => {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LOCALE;
  }

  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.includes(saved as AppLocale)) {
      return saved as AppLocale;
    }
  } catch {
    return DEFAULT_LOCALE;
  }

  return DEFAULT_LOCALE;
};

const initialLocale = readSavedLocale();

export const i18nReady = i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLocale;
}

export default i18n;
