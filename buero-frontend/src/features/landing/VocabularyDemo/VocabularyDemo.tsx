import { useTranslation } from 'react-i18next';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import Reveal from '../shared/Reveal';
import VocabularyFlashcard from './VocabularyFlashcard';

const HINTS = ['vocabHintFlip', 'vocabHintReview', 'vocabHintListen', 'vocabHintPractise'] as const;

const VocabularyDemo = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-soapstone-base)] py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionTitle label={t('landing.vocabSection')} className="mb-4">
              {t('landing.vocabSection')}
            </SectionTitle>
            <Title className="mb-6">{t('landing.vocabTitle')}</Title>
            <Text label={t('landing.vocabSubtitle')} className="mb-8 max-w-[520px]">
              {t('landing.vocabSubtitle')}
            </Text>
            <ul className="flex flex-wrap gap-2">
              {HINTS.map((key) => (
                <li
                  key={key}
                  className="rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-3.5 py-1.5 text-[0.85rem] font-medium text-[var(--color-text-primary)]"
                >
                  {t(`landing.${key}`)}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delayMs={120} className="flex justify-center lg:justify-end">
            <VocabularyFlashcard />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};

export default VocabularyDemo;
