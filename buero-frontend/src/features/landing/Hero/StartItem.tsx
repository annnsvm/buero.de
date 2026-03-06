import { useCountUp } from "./useCountUp";

const statBlockClass = 'flex flex-col items-center gap-2 sm:flex-1 sm:items-start font-[600]';
const statsValueClass =
  'font-[family-name:var(--font-heading)] text-[2rem] leading-[1.4] tracking-[-0.26px] font-[600]';
const statsLabelClass =
  'text-base leading-[1.5] font-semibold text-[0.9rem] sm:text-[0.8rem] md:text-[1rem] text-[var(--opacity-white-60)]';

const DURATION = 2;

const StatItem: React.FC<{
  end: number;
  decimals?: number;
  suffix?: string;
  label: string;
}> = ({ end, decimals = 0, suffix = '', label }) => {
  const { value, ref } = useCountUp({
    end,
    duration: DURATION,
    decimals,
    suffix,
    enableScrollSpy: true,
    scrollSpyOnce: true,
  });

  return (
    <li className={statBlockClass}>
      <p className={statsValueClass} aria-live="polite">
        <span ref={ref}>{value}</span>
      </p>
      <p className={statsLabelClass}>{label}</p>
    </li>
  );
};

export default StatItem;