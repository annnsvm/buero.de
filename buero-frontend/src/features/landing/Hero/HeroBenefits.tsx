import { useTranslation } from 'react-i18next';
import { Award, Gauge, Play } from 'lucide-react';

const BENEFITS = [
  { Icon: Gauge, key: 'heroBenefitPace' as const },
  { Icon: Award, key: 'heroBenefitLifetime' as const },
  { Icon: Play, key: 'heroBenefitTrial' as const },
];

const HeroBenefits = () => {
  const { t } = useTranslation();

  return (
    <ul
      className="flex w-full flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
      aria-label={t('landing.heroBenefits')}
    >
      {BENEFITS.map(({ Icon, key }, index) => (
        <li
          key={key}
          className="buero-hero-benefit flex max-w-[240px] flex-row items-center gap-3 text-left sm:flex-1"
          style={{ animationDelay: `${360 + index * 110}ms` }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--opacity-white-20)]">
            <Icon size={22} strokeWidth={2} color="var(--color-white)" aria-hidden />
          </span>
          <p className="text-[0.95rem] leading-[1.4] font-semibold text-[var(--opacity-white-60)] sm:text-[1rem]">
            {t(`landing.${key}`)}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default HeroBenefits;
