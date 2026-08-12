import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import type { CallToActionProps } from '@/types/features/home/CallToAction.types';
import CallToActionBanner from './CallToActionBanner';
import CallToActionButtons from './CallToActionButtons';

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonTo = ROUTES.HOME,
  secondaryButtonTo = ROUTES.COURSES,
}) => {
  const { t } = useTranslation();

  return (
    <Section className="pb-0">
      <CallToActionBanner>
        <Container className="relative z-10 flex flex-col items-center justify-center gap-8 text-center text-[var(--color-neutral-white)]">
          <h2 className="font-[family-name:var(--font-heading)] text-[2rem] font-semibold leading-tight sm:text-[2.5rem] lg:text-[3.5rem]">
            {title ?? t('landing.ctaTitle')}
          </h2>
          <p className="max-w-[600px] text-[1rem] leading-[1.5] sm:text-[1.125rem]">
            {description ?? t('landing.ctaDescription')}
          </p>
          <CallToActionButtons
            primaryText={primaryButtonText ?? t('landing.startFreeTrial')}
            primaryTo={primaryButtonTo}
            secondaryText={secondaryButtonText ?? t('landing.viewPricing')}
            secondaryTo={secondaryButtonTo}
          />
        </Container>
      </CallToActionBanner>
    </Section>
  );
};

export default CallToAction;
