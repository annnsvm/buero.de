import React from 'react';
import { Container, Section } from '@/components/layout';
import { Icon } from '@/components/ui';
import LinkBtn from '@/components/ui/Link';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';
import type { CallToActionProps } from '@/types/features/home/CallToAction.types';

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
  backgroundImage,
}) => {
  return (
    <Section className="pb-0">
      <div
        className="relative flex min-h-[331px] w-full items-center justify-center overflow-hidden bg-[var(--color-cod-gray-base)] py-20 sm:min-h-[400px] lg:min-h-[531px]"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-[var(--color-cod-gray-base)]/70"
          aria-hidden
        />
        <Container className="relative z-10 flex flex-col items-center justify-center gap-8 text-center text-[var(--color-neutral-white)]">
          <h2 className="font-[family-name:var(--font-heading)] text-[2rem] font-semibold leading-tight sm:text-[2.5rem] lg:text-[3.5rem]">
            {title}
          </h2>
          <p className="max-w-[600px] text-[1rem] leading-[1.5] sm:text-[1.125rem]">
            {description}
          </p>
          <div
            className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row sm:gap-6"
            aria-label="Call to action buttons"
          >
            <LinkBtn
              to={primaryButtonTo}
              variant="primary"
              className="flex items-center gap-2"
            >
              <span>{primaryButtonText}</span>
              <Icon
                name={ICON_NAMES.ARROW_RIGHT}
                color="var(--color-white)"
                size={18}
              />
            </LinkBtn>
            <LinkBtn to={secondaryButtonTo} variant="outline">
              {secondaryButtonText}
            </LinkBtn>
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default CallToAction;
