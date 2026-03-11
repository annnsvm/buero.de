import React from 'react';
import CallToActionBackground from './CallToActionBackground';

type CallToActionBannerProps = {
  children: React.ReactNode;
};

const CallToActionBanner: React.FC<CallToActionBannerProps> = ({ children }) => (
  <div className="relative flex min-h-[331px] w-full items-center justify-center overflow-hidden bg-[var(--color-cod-gray-base)] py-20 sm:min-h-[400px] lg:min-h-[531px]">
    <CallToActionBackground />
    {children}
  </div>
);

export default CallToActionBanner;
