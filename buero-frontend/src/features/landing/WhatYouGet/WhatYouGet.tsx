import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import Reveal from '../shared/Reveal';
import LandingCta from '../shared/LandingCta';

const ITEM_KEYS = [
  'whatYouGetTrial',
  'whatYouGetLifetime',
  'whatYouGetOneOnOne',
  'whatYouGetPace',
  'whatYouGetLanguage',
  'whatYouGetIntegration',
  'whatYouGetStructured',
  'whatYouGetVideo',
  'whatYouGetExercises',
  'whatYouGetVocab',
  'whatYouGetQuiz',
  'whatYouGetGrammar',
  'whatYouGetProgress',
  'whatYouGetDevices',
  'whatYouGetTeachers',
  'whatYouGetContinue',
] as const;

const HIGHLIGHT_KEYS = new Set<(typeof ITEM_KEYS)[number]>([
  'whatYouGetTrial',
  'whatYouGetLifetime',
  'whatYouGetOneOnOne',
]);

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
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2"
          aria-label={t('landing.whatYouGetAria')}
        >
          {ITEM_KEYS.map((key, index) => {
            const highlighted = HIGHLIGHT_KEYS.has(key);

            return (
              <li key={key} className="h-full">
                <Reveal delayMs={Math.min(index * 40, 320)} className="h-full">
                  <div
                    className={[
                      'flex h-full items-start gap-3.5 rounded-[18px] border px-4 py-4 transition-transform duration-300 hover:-translate-y-0.5 sm:gap-4 sm:px-5 sm:py-5',
                      highlighted
                        ? 'border-[var(--color-burnt-siena-base)]/35 bg-[var(--color-burnt-siena-lightest)] shadow-[0_10px_28px_rgba(231,110,80,0.08)]'
                        : 'border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] hover:shadow-[0_12px_32px_rgba(1,1,1,0.05)]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11',
                        highlighted
                          ? 'bg-[var(--color-burnt-siena-base)] text-white'
                          : 'bg-[var(--color-burnt-siena-lighter)]',
                      ].join(' ')}
                    >
                      <Check
                        size={highlighted ? 22 : 22}
                        strokeWidth={highlighted ? 3 : 2.5}
                        color={
                          highlighted ? 'currentColor' : 'var(--color-burnt-siena-base)'
                        }
                        aria-hidden
                      />
                    </span>
                    <span className="min-w-0 pt-1.5 font-[family-name:var(--font-heading)] text-[1.05rem] leading-[1.35] font-semibold text-[var(--color-cod-gray-base)] sm:pt-2 sm:text-[1.12rem]">
                      {t(`landing.${key}`)}
                    </span>
                  </div>
                </Reveal>
              </li>
            );
          })}
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
