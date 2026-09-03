import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';
import TapHint from '../shared/TapHint';

const VocabularyFlashcard = () => {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-[380px]">
      <p className="mb-3 text-center text-[0.75rem] font-semibold tracking-[0.14em] text-[var(--color-accent-secondary)] uppercase">
        {t('landing.vocabTryLabel')}
      </p>
      <div className="buero-flip-scene buero-float-soft">
        <button
          type="button"
          className={[
            'buero-flip-card w-full cursor-pointer border-0 bg-transparent p-0 text-left shadow-[0_20px_50px_rgba(1,1,1,0.1)]',
            flipped ? 'buero-flip-card--flipped' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setFlipped((v) => !v)}
          aria-pressed={flipped}
          aria-label={
            flipped ? t('landing.vocabFlipBackAria') : t('landing.vocabFlipAria')
          }
        >
          <div className="buero-flip-face relative flex flex-col justify-between border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-7 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-[var(--color-burnt-siena-lightest)] px-3 py-1 text-[0.7rem] font-semibold tracking-[0.1em] text-[var(--color-burnt-siena-dark)] uppercase">
                {t('landing.vocabInteractive')}
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-dawn-pink-base)] text-[var(--color-burnt-siena-dark)]"
                aria-hidden="true"
              >
                <Volume2 size={16} strokeWidth={2.25} />
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <p className="font-[family-name:var(--font-heading)] text-[1.85rem] leading-[1.2] font-semibold tracking-[-0.03em] text-[var(--color-cod-gray-base)] sm:text-[2.1rem]">
                die Voraussetzung
              </p>
              <p className="mt-4 flex items-center justify-center gap-2 text-[0.9rem] text-[var(--color-text-secondary)]">
                <TapHint visible />
                {t('landing.vocabTapReveal')}
              </p>
            </div>
          </div>

          <div className="buero-flip-face buero-flip-face--back flex flex-col justify-between border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-cod-gray-base)] p-7 text-[var(--color-neutral-white)] sm:p-8">
            <span className="rounded-full border border-white/20 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.1em] text-white/70 uppercase">
              {t('landing.vocabTranslation')}
            </span>
            <div className="flex flex-1 flex-col justify-center py-6">
              <p className="font-[family-name:var(--font-heading)] text-[1.85rem] leading-[1.2] font-semibold tracking-[-0.03em] sm:text-[2.1rem]">
                {t('landing.vocabMeaning')}
              </p>
              <p className="mt-2 text-[0.85rem] font-semibold tracking-[0.08em] text-[var(--color-burnt-siena-light)] uppercase">
                {t('landing.vocabExampleLabel')}
              </p>
              <p className="mt-2 text-[1rem] leading-[1.55] text-white/80">
                {t('landing.vocabExample')}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VocabularyFlashcard;
