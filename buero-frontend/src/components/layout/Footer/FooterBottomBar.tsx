import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/helpers/routes';
import Container from '../Container/Container';

const linkClass =
  'text-[0.8125rem] text-[var(--color-neutral-light)] underline transition-colors hover:text-[var(--color-neutral-white)]';

const FooterBottomBar: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-[var(--opacity-neutral-darkest-15)]">
      <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p className="order-2 text-[0.8125rem] text-[var(--color-neutral-base)] sm:order-1">
          {t('footer.copyright', { year: currentYear })}
        </p>
        <nav aria-label={t('footer.legalNav')} className="order-1 flex flex-wrap items-center justify-center gap-4 sm:order-2">
          <Link to={ROUTES.PRIVACY} className={linkClass}>
            {t('footer.privacyPolicy')}
          </Link>
          <Link to={ROUTES.TERMS} className={linkClass}>
            {t('footer.terms')}
          </Link>
          <Link to={ROUTES.COOKIES} className={linkClass}>
            {t('footer.cookies')}
          </Link>
        </nav>
      </Container>
    </div>
  );
};

export default FooterBottomBar;
