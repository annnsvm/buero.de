import React from 'react';
import Logo from '../Logo/Logo';

const GlobalLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0a0a0b]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <div className="relative flex items-center justify-center px-8">
        <span
          className="buero-loader-glow pointer-events-none absolute top-1/2 left-[28%] h-24 w-24 -translate-x-1/2 -translate-y-[70%] rounded-full bg-[var(--color-burnt-siena-base)]/35 blur-2xl"
          aria-hidden
        />
        <Logo
          isLight
          width={280}
          height={112}
          alt=""
          className="buero-loader-logo relative h-auto w-[min(72vw,220px)]"
        />
      </div>
    </div>
  );
};

export default GlobalLoader;
