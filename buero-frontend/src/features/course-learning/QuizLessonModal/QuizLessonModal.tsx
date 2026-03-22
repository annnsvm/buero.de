import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import type { ParsedQuizQuestion } from '@/pages/CoursePage/coursePageMappers';

export type QuizLessonModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown as "Hi, {greetingName}!" */
  greetingName: string;
  /** Material title shown inside the quiz card */
  quizMaterialTitle: string;
  questions: ParsedQuizQuestion[];
};

const letterLabel = (index: number) => String.fromCharCode(97 + index);

const isQuestionAnsweredCorrectly = (
  q: ParsedQuizQuestion,
  selections: Record<string, string[]>,
): boolean => {
  const correctIds = new Set(q.answers.filter((a) => a.isCorrect).map((a) => a.id));
  const selected = new Set(selections[q.id] ?? []);
  return correctIds.size === selected.size && [...correctIds].every((id) => selected.has(id));
};

const QuizLessonModal: React.FC<QuizLessonModalProps> = ({
  isOpen,
  onOpenChange,
  greetingName,
  quizMaterialTitle,
  questions,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  /** questionId -> selected option ids (multi-select) */
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [quizResult, setQuizResult] = useState<{
    correct: number;
    total: number;
    percent: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuestionIndex(0);
    setSelections({});
    setQuizResult(null);
  }, [isOpen, questions]);

  const safeIndex = Math.min(questionIndex, Math.max(0, questions.length - 1));
  const current = questions[safeIndex];
  const total = questions.length;
  const isLastQuestion = total > 0 && safeIndex === total - 1;

  const toggleOption = useCallback((questionId: string, optionId: string) => {
    setQuizResult(null);
    setSelections((prev) => {
      const cur = prev[questionId] ?? [];
      const has = cur.includes(optionId);
      const next = has ? cur.filter((id) => id !== optionId) : [...cur, optionId];
      return { ...prev, [questionId]: next };
    });
  }, []);

  const handleCheck = useCallback(() => {
    if (questions.length === 0) return;
    const correct = questions.reduce(
      (acc, q) => acc + (isQuestionAnsweredCorrectly(q, selections) ? 1 : 0),
      0,
    );
    const totalQs = questions.length;
    const percent = totalQs > 0 ? Math.round((correct / totalQs) * 100) : 0;
    setQuizResult({ correct, total: totalQs, percent });
  }, [questions, selections]);

  const handleSkip = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDone = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleGoOneMoreTime = useCallback(() => {
    setQuizResult(null);
    setQuestionIndex(0);
    setSelections({});
  }, []);

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={onOpenChange}
      contentClassName="fixed top-[80px] left-1/2 z-[1001] flex max-h-[calc(100vh-48px-24px)] w-full max-w-[min(96vw,720px)] flex-col gap-0 -translate-x-1/2 overflow-y-auto rounded-[12px] bg-[var(--color-neutral-white)] p-6 shadow-xl focus:outline-none sm:p-8 md:p-10"
    >
      <div className="pr-8 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] md:text-3xl">
          Hi, {greetingName}!
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] md:text-base">
          Ready to check yourself!
        </p>
      </div>

      <div className="relative mt-8 rounded-2xl bg-[var(--color-surface-section)] p-5 sm:p-6 md:p-8">
        {total === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)]">No questions in this quiz yet.</p>
        ) : (
          <>
            <h3 className="text-center text-lg font-bold text-[var(--color-text-primary)]">
              {quizMaterialTitle || 'Quiz'}
            </h3>

            {current ? (
              <div className="relative mt-6">
                <button
                  type="button"
                  aria-label="Previous question"
                  disabled={safeIndex <= 0}
                  onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
                  className="absolute top-1/2 left-0 z-10 -translate-x-1 -translate-y-1/2 rounded-full p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-white)] disabled:cursor-not-allowed disabled:opacity-30 sm:-translate-x-2"
                >
                  <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Next question"
                  disabled={safeIndex >= total - 1}
                  onClick={() => setQuestionIndex((i) => Math.min(total - 1, i + 1))}
                  className="absolute top-1/2 right-0 z-10 -translate-y-1/2 translate-x-1 rounded-full p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-white)] disabled:cursor-not-allowed disabled:opacity-30 sm:translate-x-2"
                >
                  <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
                </button>

                <div className="mx-auto max-w-lg px-8 sm:px-10">
                  <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Question {safeIndex + 1}
                  </p>
                  <p className="mt-1 text-center text-xs text-[var(--color-text-secondary)]">
                    There might be a few answers
                  </p>
                  <p className="mt-4 text-center text-base font-bold text-[var(--color-text-primary)] md:text-lg">
                    {current.question || 'Your question?'}
                  </p>

                  <ul className="mt-6 space-y-4">
                    {current.answers.map((answer, idx) => {
                      const selected = (selections[current.id] ?? []).includes(answer.id);
                      return (
                        <li key={answer.id} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleOption(current.id, answer.id)}
                            className="mt-1 size-5 shrink-0 cursor-pointer rounded border-2 border-[var(--color-border-default)] accent-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 focus:outline-none"
                            aria-label={`Answer ${letterLabel(idx)}`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-[var(--color-text-primary)]">
                              <span className="font-bold">{letterLabel(idx)}) </span>
                              {answer.text.trim() ? answer.text : 'answer'}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {quizResult ? (
        <div
          className="mt-8 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-section)] px-6 py-5 text-center sm:px-8"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Your result</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--color-primary)]">
            {quizResult.percent}%
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {quizResult.correct} of {quizResult.total} questions correct
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        {quizResult ? (
          <>
            <button
              type="button"
              onClick={handleDone}
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full bg-[var(--color-neutral-darkest)] px-8 py-3 text-sm font-medium text-[var(--color-neutral-white)] transition hover:opacity-90 sm:w-auto"
            >
              Done
            </button>
            <button
              type="button"
              onClick={handleGoOneMoreTime}
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-section)] sm:w-auto"
            >
              Go one more time
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCheck}
              disabled={total === 0 || !current || !isLastQuestion}
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Check yourself
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-section)] sm:w-auto"
            >
              Skip the quiz
            </button>
          </>
        )}
      </div>
    </BaseDialog>
  );
};

export default QuizLessonModal;
