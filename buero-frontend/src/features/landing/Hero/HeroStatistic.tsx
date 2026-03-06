import React from 'react';
import StatItem from './StartItem';

const HeroStatistic: React.FC = () => {
  return (
    <ul
      className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-12"
      aria-label="Hero Statistics"
    >
      <StatItem end={12} suffix="k+" label="Active learners" />
      <StatItem end={96} suffix="%" label="Completion rate" />
      <StatItem end={4.9} decimals={1} label="Average rating" />
    </ul>
  );
};

export default HeroStatistic;
