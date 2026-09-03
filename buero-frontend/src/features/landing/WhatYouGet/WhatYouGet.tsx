import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import Reveal from '../shared/Reveal';
import LandingCta from '../shared/LandingCta';

const ITEM_KEYS = [
  'whatYouGetBundle',
  'whatYouGetGrammar',
  'whatYouGetTeachers',
  'whatYouGetDevices',
  'whatYouGetContinue',
  'whatYouGetOneOnOne',
] as const;

const WhatYouGet: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-surface-section)] py-16 sm:py-20">
      <Container>
        <Reveal className="max-w-3xl">
          <SectionTitle label={t('landing.whatYouGetSection')} className="mb-4">
            {t('landing.whatYouGetSection')}
          </SectionTitle>
          <Title className="mb-4 max-w-[900px]">{t('landing.whatYouGetTitle')}</Title>
          <Text label={t('landing.whatYouGetSubtitle')} className="mb-10 max-w-[640px] sm:mb-12">
            {t('landing.whatYouGetSubtitle')}
          </Text>
        </Reveal>

        <ul
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          aria-label={t('landing.whatYouGetAria')}
        >
          {ITEM_KEYS.map((key, index) => (
            <li key={key} className="h-full">
              <Reveal delayMs={Math.min(index * 40, 240)} className="h-full">
                <div className="flex h-full items-start gap-3.5 rounded-[18px] border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-4 py-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(1,1,1,0.05)] sm:gap-4 sm:px-5 sm:py-5">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-burnt-siena-lighter)] sm:h-11 sm:w-11">
                    <Check
                      size={22}
                      strokeWidth={2.5}
                      color="var(--color-burnt-siena-base)"
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0 pt-1.5 font-[family-name:var(--font-heading)] text-[1.05rem] leading-[1.35] font-semibold text-[var(--color-cod-gray-base)] sm:pt-2 sm:text-[1.12rem]">
                    {t(`landing.${key}`)}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delayMs={160} className="mt-12 flex flex-col items-center gap-3 sm:mt-14">
          <LandingCta label={t('landing.ctaAfterBenefits')} to={ROUTES.COURSES} />
          <p className="max-w-md text-center text-[0.95rem] text-[var(--color-text-secondary)]">
            {t('landing.ctaAfterBenefitsHint')}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
};

export default WhatYouGet;
