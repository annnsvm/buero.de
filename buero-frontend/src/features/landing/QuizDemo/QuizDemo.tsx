import { useTranslation } from 'react-i18next';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import Reveal from '../shared/Reveal';
import LandingCta from '../shared/LandingCta';
import QuizCard from './QuizCard';

const QuizDemo = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-surface-section)] py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-1 lg:order-2">
            <SectionTitle label={t('landing.quizSection')} className="mb-4">
              {t('landing.quizSection')}
            </SectionTitle>
            <Title className="mb-6">{t('landing.quizTitle')}</Title>
            <Text label={t('landing.quizSubtitle')} className="mb-4 max-w-[520px]">
              {t('landing.quizSubtitle')}
            </Text>
            <Text label={t('landing.quizBody')} className="mb-8 max-w-[520px] text-[1.05rem]">
              {t('landing.quizBody')}
            </Text>
            <LandingCta
              label={t('landing.ctaAfterDemo')}
              to={ROUTES.COURSES}
              align="start"
              className="sm:justify-start"
            />
          </Reveal>

          <Reveal delayMs={100} className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <QuizCard />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};

export default QuizDemo;
