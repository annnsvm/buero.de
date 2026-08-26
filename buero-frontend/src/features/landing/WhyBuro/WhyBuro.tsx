import { useTranslation } from 'react-i18next';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { ICON_NAMES } from '@/helpers/iconNames';
import BenefitCard from './BenefitCard';
import Reveal from '../shared/Reveal';
import LandingCta from '../shared/LandingCta';
import { ROUTES } from '@/helpers/routes';

const WhyBuro = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-soapstone-base)] pt-20 pb-24 sm:pt-16 sm:pb-20">
      <Container>
        <Reveal>
          <SectionTitle label={t('landing.whySection')}>{t('landing.whySection')}</SectionTitle>
          <Title isHome className="mb-6 sm:max-w-[700px] lg:max-w-[869px]">
            {t('landing.whyTitle')}
          </Title>
          <Text
            label="Buro explanation"
            className="mb-5 sm:max-w-[700px] lg:max-w-[869px]"
          >
            {t('landing.whyDescription')}
          </Text>
        </Reveal>

        <ul
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2"
          aria-label={t('landing.whyFeatures')}
        >
          <li className="h-full">
            <Reveal delayMs={0} className="h-full">
              <BenefitCard iconName={ICON_NAMES.PLAY_ARROW} title={t('landing.benefitStartTitle')}>
                {t('landing.benefitStartDesc')}
              </BenefitCard>
            </Reveal>
          </li>
          <li className="h-full">
            <Reveal delayMs={70} className="h-full">
              <BenefitCard iconName={ICON_NAMES.REWARD} title={t('landing.benefitLifetimeTitle')}>
                {t('landing.benefitLifetimeDesc')}
              </BenefitCard>
            </Reveal>
          </li>
          <li className="h-full">
            <Reveal delayMs={140} className="h-full">
              <BenefitCard iconName={ICON_NAMES.BOOK_A} title={t('landing.benefitStructuredTitle')}>
                {t('landing.benefitStructuredDesc')}
              </BenefitCard>
            </Reveal>
          </li>
          <li className="h-full">
            <Reveal delayMs={210} className="h-full">
              <BenefitCard iconName={ICON_NAMES.GLOBE} title={t('landing.benefitRealLifeTitle')}>
                {t('landing.benefitRealLifeDesc')}
              </BenefitCard>
            </Reveal>
          </li>
          <li className="h-full sm:col-span-2 lg:max-w-[calc(50%-0.75rem)]">
            <Reveal delayMs={280} className="h-full">
              <BenefitCard iconName={ICON_NAMES.CONTRACT} title={t('landing.benefitShortTitle')}>
                {t('landing.benefitShortDesc')}
              </BenefitCard>
            </Reveal>
          </li>
        </ul>

        <Reveal delayMs={200} className="mt-12 flex flex-col items-center gap-3 sm:mt-14">
          <LandingCta label={t('landing.ctaAfterWhy')} to={ROUTES.COURSES} />
          <p className="text-center text-[0.95rem] text-[var(--color-text-secondary)]">
            {t('landing.ctaAfterWhyHint')}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
};

export default WhyBuro;
