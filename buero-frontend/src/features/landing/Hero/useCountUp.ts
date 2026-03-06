import { useEffect, useRef, useState } from 'react';

type UseCountUpOptions = {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  enableScrollSpy?: boolean;
  scrollSpyOnce?: boolean;
};

const easeOutQuart = (t: number): number => 1 - (1 - t) ** 4;

export const useCountUp = ({
  end,
  duration = 2,
  decimals = 0,
  suffix = '',
  prefix = '',
  enableScrollSpy = true,
  scrollSpyOnce = true,
}: UseCountUpOptions): { value: string; ref: React.RefObject<HTMLSpanElement | null> } => {
  const [value, setValue] = useState(0);
  const hasAnimatedRef = useRef(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (enableScrollSpy && !ref.current) return;

    const runAnimation = () => {
      if (scrollSpyOnce && hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = eased * end;
        setValue(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setValue(end);
        }
      };

      requestAnimationFrame(tick);
    };

    if (!enableScrollSpy) {
      runAnimation();
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) runAnimation();
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, enableScrollSpy, scrollSpyOnce]);

  const formatted =
    prefix +
    (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()) +
    suffix;

  return { value: formatted, ref };
};
