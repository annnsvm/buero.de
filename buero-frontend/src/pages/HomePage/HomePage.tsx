import {
  CallToAction,
  Faq,
  Hero,
  LearningLoop,
  PlatformPreview,
  QuizDemo,
  Teachers,
  VocabularyDemo,
  WhatYouGet,
  WhyBuro,
} from '@/features/landing';

import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div aria-label="Home Page">
      <Hero />
      <WhyBuro />
      <LearningLoop />
      <PlatformPreview />
      <VocabularyDemo />
      <QuizDemo />
      <Teachers />
      <WhatYouGet />
      <Faq />
      <CallToAction />
    </div>
  );
};

export default HomePage;
