import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { ICON_NAMES } from '@/helpers/iconNames';
import { List } from './List';

const WhyBuro: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-soapstone-base)] pt-20 pb-28 sm:pt-16 sm:pb-16">
      <Container>
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
        <ul
          className="mt-12 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4"
          aria-label={t('landing.whyFeatures')}
        >
          <List iconName={ICON_NAMES.BOOK_A} title={t('landing.structuredCurriculum')}>
            {t('landing.structuredCurriculumDesc')}
          </List>
          <List iconName={ICON_NAMES.GLOBE} title={t('landing.culturalIntegration')}>
            {t('landing.culturalIntegrationDesc')}
          </List>
          <List iconName={ICON_NAMES.CONTRACT} title={t('landing.realLifeScenarios')}>
            {t('landing.realLifeScenariosDesc')}
          </List>
          <List iconName={ICON_NAMES.PERSON} title={t('landing.communityLearning')}>
            {t('landing.communityLearningDesc')}
          </List>
        </ul>
      </Container>
    </Section>
  );
};

export default WhyBuro;
