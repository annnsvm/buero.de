import React from 'react';
import { useTranslation } from 'react-i18next';
import StatItem from './StartItem';

const HeroStatistic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ul
      className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-12"
      aria-label="Hero Statistics"
    >
      <StatItem end={12} suffix="k+" label={t('landing.activeLearners')} />
      <StatItem end={96} suffix="%" label={t('landing.completionRate')} />
      <StatItem end={4.9} decimals={1} label={t('landing.averageRating')} />
    </ul>
  );
};

export default HeroStatistic;
