import { useTranslation } from 'react-i18next';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import Reveal from '../shared/Reveal';
import QuizCard from './QuizCard';

const QuizDemo = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-surface-section)] py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex justify-center lg:order-1 lg:justify-start">
            <QuizCard />
          </Reveal>

          <Reveal delayMs={100} className="lg:order-2">
            <SectionTitle label={t('landing.quizSection')} className="mb-4">
              {t('landing.quizSection')}
            </SectionTitle>
            <Title className="mb-6">{t('landing.quizTitle')}</Title>
            <Text label={t('landing.quizSubtitle')} className="mb-4 max-w-[520px]">
              {t('landing.quizSubtitle')}
            </Text>
            <Text label={t('landing.quizBody')} className="max-w-[520px] text-[1.05rem]">
              {t('landing.quizBody')}
            </Text>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};

export default QuizDemo;
