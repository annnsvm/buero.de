import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  ListChecks,
  PenLine,
  TrendingUp,
} from 'lucide-react';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import Reveal from '../shared/Reveal';
import ProgressPreview from '../WhyBuro/ProgressPreview';

const STEPS = [
  { Icon: Clapperboard, titleKey: 'loopWatchTitle', descKey: 'loopWatchDesc' },
  { Icon: PenLine, titleKey: 'loopPractiseTitle', descKey: 'loopPractiseDesc' },
  { Icon: BookOpenCheck, titleKey: 'loopReviewTitle', descKey: 'loopReviewDesc' },
  { Icon: ListChecks, titleKey: 'loopTestTitle', descKey: 'loopTestDesc' },
  { Icon: TrendingUp, titleKey: 'loopTrackTitle', descKey: 'loopTrackDesc' },
] as const;

const LearningLoop = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-surface-section)] py-16 sm:py-20">
      <Container>
        <Reveal className="max-w-3xl">
          <SectionTitle label={t('landing.loopSection')} className="mb-4">
            {t('landing.loopSection')}
          </SectionTitle>
          <Title className="mb-6">{t('landing.loopTitle')}</Title>
          <Text label={t('landing.loopSubtitle')} className="mb-12 max-w-[640px]">
            {t('landing.loopSubtitle')}
          </Text>
        </Reveal>

        <ol className="m-0 flex list-none flex-col items-stretch gap-0 p-0 lg:flex-row lg:items-center">
          {STEPS.map(({ Icon, titleKey, descKey }, index) => {
            const isLast = index === STEPS.length - 1;

            return (
              <Fragment key={titleKey}>
                <li className="m-0 min-w-0 list-none lg:flex-1">
                  <Reveal delayMs={index * 70} className="h-full">
                    <article className="flex h-full flex-col gap-3 rounded-[20px] border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(1,1,1,0.06)] sm:p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-burnt-siena-lightest)] text-[var(--color-burnt-siena-dark)]">
                          <Icon size={22} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="text-[0.75rem] font-semibold tracking-[0.12em] text-[var(--color-text-secondary)]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-heading)] text-[1.1rem] font-semibold text-[var(--color-cod-gray-base)]">
                        {t(`landing.${titleKey}`)}
                      </h3>
                      <p className="text-[0.95rem] leading-[1.5] text-[var(--color-text-primary)]">
                        {t(`landing.${descKey}`)}
                      </p>
                    </article>
                  </Reveal>
                </li>

                {!isLast ? (
                  <li
                    className="m-0 flex list-none shrink-0 items-center justify-center py-2 text-[var(--color-burnt-siena-base)] lg:w-7 lg:px-0 lg:py-0"
                    aria-hidden
                  >
                    <ChevronDown className="lg:hidden" size={18} strokeWidth={2.25} />
                    <ChevronRight className="hidden lg:block" size={18} strokeWidth={2.25} />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ol>

        <Reveal delayMs={200} className="mx-auto mt-12 max-w-[400px]">
          <ProgressPreview />
        </Reveal>
      </Container>
    </Section>
  );
};

export default LearningLoop;
