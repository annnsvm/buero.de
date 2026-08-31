import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import {
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type AppLocale,
} from '@/i18n/constants';

type LanguageSwitcherProps = {
  isLight?: boolean;
  className?: string;
};

const normalizeLocale = (value: string | null | undefined): AppLocale | null => {
  if (!value) return null;
  const base = value.toLowerCase().split('-')[0];
  if (SUPPORTED_LOCALES.includes(base as AppLocale)) {
    return base as AppLocale;
  }
  return null;
};

const nextLocale = (current: AppLocale): AppLocale => {
  const index = SUPPORTED_LOCALES.indexOf(current);
  return SUPPORTED_LOCALES[(index + 1) % SUPPORTED_LOCALES.length] ?? 'uk';
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isLight = false, className = '' }) => {
  const { i18n, t } = useTranslation();
  const current = (normalizeLocale(i18n.language) ?? 'uk') as AppLocale;

  const handleToggle = () => {
    const next = nextLocale(current);
    void i18n.changeLanguage(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  const textClass = isLight
    ? 'text-[var(--color-white)]'
    : 'text-[var(--color-text-primary)]';

  return (
    <Button
      type="button"
      styleType="mobile"
      aria-label={t('header.switchLanguage')}
      title={t('header.switchLanguage')}
      onClick={handleToggle}
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2 py-2 transition-opacity hover:opacity-80',
        textClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon name={ICON_NAMES.GLOBE} size={22} className={textClass} ariaHidden />
      <span className="min-w-[1.75rem] text-sm font-semibold uppercase">{LOCALE_LABELS[current]}</span>
    </Button>
  );
};

export default LanguageSwitcher;
