import { useEffect, useState } from 'react';
import { useInView } from './useInView';

type AnimatedProgressBarProps = {
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  /** Delay before fill starts (ms) — helps when nested inside Reveal */
  delayMs?: number;
  durationMs?: number;
};

const AnimatedProgressBar = ({
  value,
  className = '',
  trackClassName = 'h-2 rounded-full bg-[var(--color-dawn-pink-light)]',
  fillClassName = 'rounded-full bg-[var(--color-burnt-siena-base)]',
  delayMs = 120,
  durationMs = 1100,
}: AnimatedProgressBarProps) => {
  const { ref, inView, reduced } = useInView<HTMLDivElement>({
    threshold: 0.45,
    rootMargin: '0px',
  });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (reduced) {
      setWidth(value);
      return;
    }

    if (!inView) {
      setWidth(0);
      return;
    }

    const start = window.setTimeout(() => setWidth(value), delayMs);
    return () => window.clearTimeout(start);
  }, [delayMs, inView, reduced, value]);

  return (
    <div
      ref={ref}
      className={['overflow-hidden', trackClassName, className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div
        className={['h-full origin-left', fillClassName].join(' ')}
        style={{
          width: `${width}%`,
          transition: reduced
            ? 'none'
            : `width ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </div>
  );
};

export default AnimatedProgressBar;
