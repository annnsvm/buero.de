import React from 'react';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { ICON_NAMES } from '@/helpers/iconNames';
import { List } from './List';

const WhyBuro: React.FC = () => {
  return (
    <Section>
      <Container>
        <SectionTitle label="WHY BÜRO.DE">WHY BÜRO.DE</SectionTitle>
        <Title isHome className="mb-6 sm:max-w-[700px] lg:max-w-[869px]">
          Not just language. A complete guide to German life
        </Title>
        <Text
          label="Buro explanation"
          className="mb-5 sm:max-w-[700px] lg:max-w-[869px]"
        >
          We bridge the gap between knowing the words and living the life. Every lesson brings you
          closer to feeling at home.
        </Text>
        <ul
          className="mt-12 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Why Buro Features"
        >
          <List iconName={ICON_NAMES.BOOK_A} title="Structured Curriculum">
            From A1 to C1, our courses follow a clear path designed by native German linguists and
            certified teachers.
          </List>
          <List iconName={ICON_NAMES.GLOBE} title="Cultural Integration">
            Learn how to navigate Anmeldung, health insurance, taxes, and everyday German life
            alongside your language studies.
          </List>
          <List iconName={ICON_NAMES.CONTRACT} title="Real-Life Scenarios">
            Practice with real dialogues - at the Auslanderamt, the doctor's office, your workplace,
            and the local Bäckerei.
          </List>
          <List iconName={ICON_NAMES.PERSON} title="Community Learning">
            Connect with fellow learners, join conversation groups, and build friendships that
            accelerate your integration.
          </List>
        </ul>
      </Container>
    </Section>
  );
};

export default WhyBuro;
