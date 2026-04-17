import React from 'react';

export type PageContentLoaderProps = {
  title?: string;
  message?: string;
  className?: string;
};

const PageContentLoader: React.FC<PageContentLoaderProps> = ({
  title = 'Loading',
  message,
  className = '',
}) => {
  const liveMessage = message ? `${title}. ${message}` : title;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        'flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--color-surface-section)] px-6 py-16',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="sr-only">{liveMessage}</span>

      <div
        className="relative flex h-14 w-14 items-center justify-center"
        aria-hidden="true"
      >
        <span className="absolute inset-0 rounded-full border-2 border-[var(--opacity-neutral-darkest-15)]" />
        <span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-primary)] motion-safe:animate-spin motion-reduce:animate-none"
        />
      </div>

      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <p className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </p>
        {message ? (
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{message}</p>
        ) : null}
      </div>
    </div>
  );
};

export default PageContentLoader;
