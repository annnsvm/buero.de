import React from 'react';
import HeaderAppLearning from '@/components/layout/Header/HeaderAppLearning';

const MyLearningPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-soapstone-base)]">
      <HeaderAppLearning />
      <div className="px-5 py-6 md:px-8">
        {/* My learning content will go here */}
        MyLearningPage
      </div>
    </div>
  );
};

export default MyLearningPage;