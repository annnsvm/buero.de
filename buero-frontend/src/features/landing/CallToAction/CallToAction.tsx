import React from 'react';
import { Container, Section } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import type { CallToActionProps } from '@/types/features/home/CallToAction.types';
import CallToActionBanner from './CallToActionBanner';
import CallToActionButtons from './CallToActionButtons';

const DEFAULT_TITLE = 'Your German life starts here';
const DEFAULT_DESCRIPTION =
  'Join thousands of expats who chose to truly integrate. Start with a free trial lesson today — no credit card required.';
const DEFAULT_PRIMARY_BUTTON = 'Start free trial';
const DEFAULT_SECONDARY_BUTTON = 'View pricing';

const CallToAction: React.FC<CallToActionProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  primaryButtonText = DEFAULT_PRIMARY_BUTTON,
  secondaryButtonText = DEFAULT_SECONDARY_BUTTON,
  primaryButtonTo = ROUTES.HOME,
  secondaryButtonTo = '/pricing',
}) => (
  <Section className="pb-0">
    <CallToActionBanner>
      <Container className="relative z-10 flex flex-col items-center justify-center gap-8 text-center text-[var(--color-neutral-white)]">
        <h2 className="font-[family-name:var(--font-heading)] text-[2rem] font-semibold leading-tight sm:text-[2.5rem] lg:text-[3.5rem]">
          {title}
        </h2>
        <p className="max-w-[600px] text-[1rem] leading-[1.5] sm:text-[1.125rem]">
          {description}
        </p>
        <CallToActionButtons
          primaryText={primaryButtonText}
          primaryTo={primaryButtonTo}
          secondaryText={secondaryButtonText}
          secondaryTo={secondaryButtonTo}
        />
      </Container>
    </CallToActionBanner>
  </Section>
);

export default CallToAction;
