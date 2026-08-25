import React from 'react';
import { useTranslation } from 'react-i18next';
import PropositionsList from './PropositionsList';
import PropositionImg from './PropositionImg';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import LinkBtn from '@/components/ui/Link';
import { ROUTES } from '@/helpers/routes';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';

const Proposition: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section aria-label="Proposition Section" className="bg-[var(--color-soapstone-base)] py-16">
      <Container className="flex flex-col-reverse gap-8 lg:flex-row lg:justify-between">
        <PropositionImg />
        <div className="flex w-full flex-col lg:w-[600px] lg:pt-7">
          <SectionTitle label={t('landing.propositionSection')} className="mb-4">
            {t('landing.propositionSection')}
          </SectionTitle>
          <Title className="mb-6">{t('landing.propositionTitle')}</Title>
          <Text label="Proposition description" className="mb-10">
            {t('landing.propositionDescription')}
          </Text>
          <PropositionsList className="mb-10" />
          <LinkBtn to={ROUTES.COURSES} variant="transparent" className="self-start font-[500]">
            <Text label="Link to all integration courses">{t('landing.seeAllCourses')}</Text>

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
