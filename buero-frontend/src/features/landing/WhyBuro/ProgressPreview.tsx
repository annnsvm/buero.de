import { useTranslation } from 'react-i18next';
import AnimatedProgressBar from '../shared/AnimatedProgressBar';
import AssetImage from '../shared/AssetImage';
import type { ProgressPreviewProps } from '@/types/features/home/WhyBuro.types';

const ProgressPreview = ({ screenshotSrc }: ProgressPreviewProps) => {
  const { t } = useTranslation();

  const mockup = (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-soapstone-base)] p-5 sm:p-6"
      aria-label={t('landing.progressPreviewAria')}
    >
      <p className="mb-4 text-[0.7rem] font-semibold tracking-[0.16em] text-[var(--color-accent-secondary)] uppercase">
        {t('landing.progressPreviewLabel')}
      </p>
      <p className="font-[family-name:var(--font-heading)] text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-cod-gray-base)] sm:text-[1.4rem]">
        {t('landing.progressCourse')}
      </p>
      <p className="mt-1 text-[0.95rem] text-[var(--color-text-secondary)]">
        {t('landing.progressPercent')}
      </p>
      <AnimatedProgressBar value={78} className="mt-4" delayMs={180} />
      <p className="mt-3 text-[0.9rem] text-[var(--color-text-secondary)]">
        {t('landing.progressLessons')}
      </p>
      <div className="mt-5 border-t border-[var(--opacity-neutral-darkest-15)] pt-4">
        <p className="text-[0.75rem] font-semibold tracking-[0.08em] text-[var(--color-text-secondary)] uppercase">
          {t('landing.progressNextLabel')}
        </p>
        <p className="mt-1 font-[family-name:var(--font-heading)] text-[1.05rem] text-[var(--color-cod-gray-base)]">
          {t('landing.progressNextLesson')}
        </p>
      </div>
    </div>
  );

  if (!screenshotSrc) return mockup;

  return (
    <AssetImage
      src={screenshotSrc}
      alt={t('landing.progressPreviewAria')}
      className="h-full w-full rounded-2xl object-cover"
      fallback={mockup}
    />
  );
};

export default ProgressPreview;
