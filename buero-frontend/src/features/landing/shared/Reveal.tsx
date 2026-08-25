import type { CSSProperties, ReactNode } from 'react';
import { useInView } from './useInView';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

const Reveal = ({ children, className = '', delayMs = 0 }: RevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  const style: CSSProperties | undefined = delayMs
    ? { transitionDelay: `${delayMs}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      className={['buero-reveal', inView ? 'buero-reveal--visible' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
};

export default Reveal;
