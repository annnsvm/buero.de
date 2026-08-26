import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, Logo } from '@/components/ui';
import useModal from '@/components/modal/context/useModal';
import { ROUTES } from '@/helpers/routes';

const inputClass =
  'min-w-0 w-full rounded-[12px] border border-[var(--color-neutral-lighter)] bg-transparent px-4 py-2.5 text-center text-[0.9375rem] text-[var(--color-neutral-white)] placeholder:text-[var(--color-neutral-base)] transition-colors hover:border-[var(--color-neutral-light)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-0 sm:text-left';
const contactBtnClass = 'w-full shrink-0 rounded-[100px] px-6 py-2.5 sm:w-auto';

const FooterBrand: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const { pushUiModal } = useModal();

  const handleContactClick = () => {
    pushUiModal({
      type: 'contactSupport',
      prefillEmail: email.trim(),
    });
  };

  return (
    <div className="flex w-full max-w-[520px] flex-col items-center gap-5">
      <Link
        to={ROUTES.HOME}
        className="inline-flex transition-opacity hover:opacity-80"
        aria-label={t('header.goHome')}
      >
        <Logo width={70} height={28} isLight />
      </Link>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 w-full flex-1">
            <Input
              id="footer-contact-email"
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              aria-label={t('footer.emailAria')}
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="button" variant="solid" className={contactBtnClass} onClick={handleContactClick}>
            {t('footer.contactUs')}
          </Button>
        </div>
        <p className="max-w-none whitespace-nowrap text-[0.75rem] leading-[1.4] text-[var(--color-neutral-base)]">
          {t('footer.privacyConsent')}{' '}
          <Link to={ROUTES.PRIVACY} className="underline hover:text-[var(--color-neutral-light)]">
            {t('footer.privacyPolicyLink')}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default FooterBrand;
