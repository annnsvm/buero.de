import { Container, Section, Text } from '@/components/layout';
import HeroBackground from './HeroBackground';
import HeroTitle from './HeroTitle';
import HeroActionBtn from './HeroActionBtn';
import HeroStatistic from './HeroStatistic';

const Hero: React.FC = () => {
  return (
    <Section>
      <div className="relative sm:h-auto w-full overflow-hidden">
        <HeroBackground />
        <Container className="relative z-10 flex justify-center pt-40 pb-32 text-[var(--color-white)] md:pt-46 md:pb-36">
          <div
            className="flex w-full max-w-[640px] flex-col gap-12 sm:gap-18 md:gap-20"
            aria-label="Hero Content"
          >
            <HeroTitle>
              <span>Learn German.</span>
              <span>Live German.</span>
            </HeroTitle>
            <div className="flex flex-col gap-12 sm:gap-8">
              <Text label="Hero description" className='font-bold text-[var(--color-white)]'>
                More than language course. Master German while learning to navigate real life in
                Germany — from bureaucracy to Brezeln
              </Text>
              <HeroActionBtn />
            </div>
            <HeroStatistic />
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default Hero;
