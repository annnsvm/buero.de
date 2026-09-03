import { Container, Section, Text } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import Reveal from '../shared/Reveal';
import HeroBackground from './HeroBackground';
import HeroTitle from './HeroTitle';
import HeroActionBtn from './HeroActionBtn';
import HeroBenefits from './HeroBenefits';

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isUk = i18n.language.toLowerCase().startsWith('uk');

  return (
    <Section className="relative">
      <div className="relative w-full overflow-hidden min-h-screen sm:min-h-[600px]">
        <HeroBackground />
        <Container className="relative z-10 flex justify-center pt-40 pb-32 text-[var(--color-white)] lg:pt-46 lg:pb-36">
          <div
            className={[
              'flex w-full flex-col gap-12 sm:gap-18 lg:gap-20',
              isUk ? 'max-w-[720px] items-center text-center' : 'max-w-[640px]',
            ].join(' ')}
            aria-label="Hero Content"
          >
            <Reveal>
              <HeroTitle>
                <span className="block text-balance">{t('landing.heroTitle1')}</span>
                <span className="block text-balance">{t('landing.heroTitle2')}</span>
              </HeroTitle>
            </Reveal>
            <Reveal delayMs={140} className={`flex w-full flex-col gap-12 sm:gap-8 ${isUk ? 'items-center' : ''}`}>
              <Text label="Hero description" className="font-normal text-[var(--color-white)]">
                {t('landing.heroDescription')}
              </Text>
              <HeroActionBtn />
            </Reveal>
            <HeroBenefits />
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default Hero;
