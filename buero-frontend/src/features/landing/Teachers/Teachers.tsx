import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import TeacherCard from './TeacherCard';

const Teachers: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-soapstone-base)] py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <SectionTitle label={t('landing.teachersSection')} className="mb-4">
            {t('landing.teachersSection')}
          </SectionTitle>
          <Title className="mb-6">{t('landing.teachersTitle')}</Title>
          <Text label={t('landing.teachersSubtitle')} className="mb-10 sm:mb-14">
            {t('landing.teachersSubtitle')}
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <TeacherCard
            photoSrc="/assets/teachers/anna.jpg"
            photoAlt={t('landing.founderPhotoAlt')}
            initials="A"
            name={t('landing.founderName')}
            role={t('landing.founderRole')}
            bio={t('landing.founderBio')}
            details={t('landing.founderDetails')}
          />
          <TeacherCard
            photoSrc="/assets/teachers/misha.jpg"
            photoAlt={t('landing.mishaPhotoAlt')}
            initials="M"
            name={t('landing.mishaName')}
            role={t('landing.mishaRole')}
            bio={t('landing.mishaBio')}
            details={t('landing.mishaDetails')}
          />
        </div>
      </Container>
    </Section>
  );
};

export default Teachers;
