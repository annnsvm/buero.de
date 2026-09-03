import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import TapHint from '../shared/TapHint';

const OPTIONS = [
  { id: 'a', key: 'quizOptA' as const, correct: false },
  { id: 'b', key: 'quizOptB' as const, correct: true },
  { id: 'c', key: 'quizOptC' as const, correct: false },
  { id: 'd', key: 'quizOptD' as const, correct: false },
];

const QuizCard = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedOption = OPTIONS.find((o) => o.id === selected);
  const isCorrect = selectedOption?.correct === true;
  const isWrong = selected != null && !isCorrect;

  return (
    <div className="w-full max-w-[440px] rounded-[24px] border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-6 shadow-[0_20px_50px_rgba(1,1,1,0.08)] sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="rounded-full bg-[var(--color-burnt-siena-lightest)] px-3 py-1 text-[0.7rem] font-semibold tracking-[0.12em] text-[var(--color-burnt-siena-dark)] uppercase">
          {t('landing.quizBadge')}
        </span>
        <span className="text-[0.85rem] font-medium text-[var(--color-text-secondary)]">
          {t('landing.quizProgress')}
        </span>
      </div>

      <p className="font-[family-name:var(--font-heading)] text-[1.25rem] leading-[1.35] font-semibold tracking-[-0.02em] text-[var(--color-cod-gray-base)] sm:text-[1.4rem]">
        {t('landing.quizQuestion')}
      </p>

      <ul className="mt-6 flex flex-col gap-2.5" role="listbox" aria-label={t('landing.quizOptionsAria')}>
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = isSelected && opt.correct;
          const showWrong = isSelected && !opt.correct;

          return (
            <li key={opt.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelected(opt.id)}
                className={[
                  'flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[1rem] transition-all duration-200',
                  showCorrect
                    ? 'border-[var(--color-burnt-siena-base)] bg-[var(--color-burnt-siena-lightest)] text-[var(--color-burnt-siena-darker)]'
                    : showWrong
                      ? 'border-[var(--color-neutral-light)] bg-[var(--color-neutral-lightest)] text-[var(--color-text-primary)]'
                      : 'border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-soapstone-base)] text-[var(--color-cod-gray-base)] hover:border-[var(--color-burnt-siena-light)] hover:bg-[var(--color-dawn-pink-lightest)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-semibold',
                    showCorrect
                      ? 'bg-[var(--color-burnt-siena-base)] text-white'
                      : 'bg-[var(--color-neutral-white)] text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {showCorrect ? <Check size={14} strokeWidth={3} /> : opt.id.toUpperCase()}
                </span>
                <span className="font-medium">{t(`landing.${opt.key}`)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-center justify-center gap-2 text-[0.9rem] text-[var(--color-text-secondary)]">
        <TapHint visible />
        {t('landing.quizTapHint')}
      </p>

      <div className="mt-5 min-h-[1.5rem]" aria-live="polite">
        {isCorrect ? (
          <p className="text-[0.95rem] font-semibold text-[var(--color-burnt-siena-dark)]">
            {t('landing.quizCorrect')}
          </p>
        ) : null}
        {isWrong ? (
          <p className="text-[0.95rem] font-medium text-[var(--color-text-secondary)]">
            {t('landing.quizWrong')}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default QuizCard;
