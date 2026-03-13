import React from "react";
import { TrackYourProgressImg } from "./TrackYourProgressImg";
import { TrackYourProgressList } from "./TrackYourProgressList";
import type { TrackYourProgresStat } from "@/types/features/home/TrackYourProgress.types";
import { Section,Container ,Title, Text, SectionTitle} from "@/components/layout";



const propositionStats: TrackYourProgresStat[] = [
  { value: "200+", label: "Video Lessons" },
  { value: "1,500+", label: "Practice Exercises" },
  { value: "80+", label: "Cultural Guides" },
  { value: "300+", label: "Hours of Content" },
];

const TrackYourProgress: React.FC = () => {
  return (
    <Section className="bg-[#f5f3f1] px-6 py-16 md:px-10 lg:px-16 lg:py-24">
      <Container className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="max-w-[680px]">
          <SectionTitle label="Track your journey" className="mb-4">
            TRACK YOUR JOURNEY
          </SectionTitle>

          <Title className="mb-6">
            Your progress, always visible
          </Title>

          <Text label="Track your progress description" className="mb-10">
            Watch your German skills grow lesson by lesson. Our learning
            dashboard keeps you motivated with clear progress tracking,
            streaks, and milestone celebrations.
          </Text>

          <div className="mt-12">
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