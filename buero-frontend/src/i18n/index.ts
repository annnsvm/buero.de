import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk/translation.json';
import en from './locales/en/translation.json';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type AppLocale, SUPPORTED_LOCALES } from './constants';

const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
const initialLocale: AppLocale =
  saved && SUPPORTED_LOCALES.includes(saved as AppLocale) ? (saved as AppLocale) : DEFAULT_LOCALE;

void i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
});

document.documentElement.lang = initialLocale;

export default i18n;
