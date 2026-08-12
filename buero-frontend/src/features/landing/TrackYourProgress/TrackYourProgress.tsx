import React from "react";
import { useTranslation } from "react-i18next";
import { TrackYourProgressImg } from "./TrackYourProgressImg";
import { TrackYourProgressList } from "./TrackYourProgressList";
import type { TrackYourProgresStat } from "@/types/features/home/TrackYourProgress.types";
import { Section,Container ,Title, Text, SectionTitle} from "@/components/layout";

const TrackYourProgress: React.FC = () => {
  const { t } = useTranslation();

  const propositionStats: TrackYourProgresStat[] = [
    { value: "200+", label: t('landing.videoLessons') },
    { value: "1,500+", label: t('landing.practiceExercises') },
    { value: "80+", label: t('landing.culturalGuides') },
    { value: "300+", label: t('landing.hoursOfContent') },
  ];

  return (
    <Section className="bg-[var(--color-soapstone-base)] py-14 sm:py-16 md:py-20 lg:py-24">
      <Container className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="max-w-[680px]">
          <SectionTitle label={t('landing.trackSection')} className="mb-4">
            {t('landing.trackSection')}
          </SectionTitle>

          <Title className="mb-6">
            {t('landing.trackTitle')}
          </Title>

          <Text label="Track your progress description" className="mb-10">
            {t('landing.trackDescription')}
          </Text>

          <div className="mt-8 sm:mt-10 lg:mt-12">
            <TrackYourProgressList items={propositionStats} />
          </div>
        </div>

        <TrackYourProgressImg
          src="/images/home/landing-progress-img.webp"
          alt="Workspace with laptop, globe, and coffee"
        />
      </Container>
    </Section>
  );
};

export default TrackYourProgress;
