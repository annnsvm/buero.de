import React from 'react';
import PropositionsList from './PropositionsList';
import PropositionImg from './PropositionImg';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import LinkBtn from '@/components/ui/Link';
import { ROUTES } from '@/helpers/routes';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';

const Proposition: React.FC = () => {
  return (
    <Section aria-label="Proposition Section" className="bg-[var(--color-surface-section)] py-16">
      <Container className="flex flex-col-reverse gap-8 lg:flex-row lg:justify-between">
        <PropositionImg />
        <div className="flex w-full flex-col lg:w-[600px] lg:pt-7">
          <SectionTitle label="Our Proposition" className="mb-4">
            BEYOND THE CLASSROOM
          </SectionTitle>
          <Title className="mb-6">Learn the language of everyday life</Title>
          <Text label="Proposition description" className="mb-10">
            Our courses don't stop at grammar and vocabulary. We teach you how to order at a Kneipe,
            what to say at the Bürgeramt, how German humor works, and why you should never be late
          </Text>
          <PropositionsList className="mb-10" />
          <LinkBtn to={ROUTES.COURSES} variant="transparent" className="self-start font-[500]">
            <Text label="Link to all integration courses">See all integration courses</Text>

            <Icon
              name={ICON_NAMES.ARROW_RIGHT}
              className="animate-bounce-x"
              size={13}
              strokeWidth={5}
            />
          </LinkBtn>
        </div>
      </Container>
    </Section>
  );
};

export default Proposition;
