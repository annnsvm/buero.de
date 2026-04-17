import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import ModalScrollArea from '@/components/modal/ModalScrollArea';
import { startQuizAttempt, submitQuizAttempt } from '@/api/quizApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import type { ParsedQuizQuestion } from '@/pages/CoursePage/coursePageMappers';

export type QuizResultSummary = {
  correct: number;
  total: number;
  percent: number;
};

export type QuizLessonModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** UUID матеріалу квізу — для POST /quiz/attempts */
  courseMaterialId: string;
  greetingName: string;
  quizMaterialTitle: string;
  questions: ParsedQuizQuestion[];
  onQuizResult?: (result: QuizResultSummary | null) => void;
};

const letterLabel = (index: number) => String.fromCharCode(97 + index);

type QuizLessonModalBodyProps = {
  courseMaterialId: string;
  greetingName: string;
  quizMaterialTitle: string;
  questions: ParsedQuizQuestion[];
  onOpenChange: (open: boolean) => void;
  onQuizResult?: (result: QuizResultSummary | null) => void;
};

const QuizLessonModalBody: React.FC<QuizLessonModalBodyProps> = ({
  courseMaterialId,
  greetingName,
  quizMaterialTitle,
  questions,
  onOpenChange,
  onQuizResult,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [quizResult, setQuizResult] = useState<QuizResultSummary | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [attemptStartError, setAttemptStartError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const safeIndex = Math.min(questionIndex, Math.max(0, questions.length - 1));
  const current = questions[safeIndex];
  const total = questions.length;
  const isLastQuestion = total > 0 && safeIndex === total - 1;

  const runStartAttempt = useCallback(async () => {
    setAttemptLoading(true);
    setAttemptStartError(null);
    setAttemptId(null);
    try {
      const { id } = await startQuizAttempt(courseMaterialId);
      setAttemptId(id);
    } catch (err: unknown) {
      setAttemptStartError(
        getErrorMessage(err, 'Could not start quiz attempt. Check that you are logged in as a student with access to this course.'),
      );
    } finally {
      setAttemptLoading(false);
    }
  }, [courseMaterialId]);

  useEffect(() => {
    void runStartAttempt();
  }, [runStartAttempt]);

  const toggleOption = useCallback((questionId: string, optionId: string) => {
    setQuizResult(null);
    setSubmitError(null);
    setSelections((prev) => {
      const cur = prev[questionId] ?? [];
      const has = cur.includes(optionId);
      const next = has ? cur.filter((id) => id !== optionId) : [...cur, optionId];
      return { ...prev, [questionId]: next };
    });
  }, []);

  const handleCheck = useCallback(async () => {
    if (questions.length === 0 || !attemptId) return;
    const unanswered = questions.some((q) => (selections[q.id] ?? []).length === 0);
    if (unanswered) {
      setSubmitError('Please answer every question before checking.');
      return;
    }
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      const answers = questions.map((q) => {
        const sel = selections[q.id] ?? [];
        const answer = sel.length === 1 ? sel[0] : [...sel];
        return { question_id: q.id, answer };
      });
      const data = await submitQuizAttempt(attemptId, { answers });
      const percent = Math.round(data.score);
      const summary: QuizResultSummary = {
        correct: data.correct,
        total: data.total,
        percent,
      };
      setQuizResult(summary);
      onQuizResult?.(summary);
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err, 'Failed to submit quiz.'));
    } finally {
      setSubmitLoading(false);
    }
  }, [attemptId, questions, selections, onQuizResult]);

  const handleSkip = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDone = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleGoOneMoreTime = useCallback(async () => {
    setQuizResult(null);
    setQuestionIndex(0);
    setSelections({});
    setSubmitError(null);
    onQuizResult?.(null);
    await runStartAttempt();
  }, [onQuizResult, runStartAttempt]);

  const canSubmit =
    Boolean(attemptId) &&
    !attemptLoading &&
    !attemptStartError &&
    !submitLoading &&
    total > 0 &&
    Boolean(current) &&
    isLastQuestion;

  return (
    <>
      <div className="pr-8 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] md:text-3xl">
          Hi, {greetingName}!
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] md:text-base">
          Ready to check yourself!
        </p>
      </div>

      <div className="relative mt-8 rounded-2xl bg-[var(--color-surface-section)] p-5 sm:p-6 md:p-8">
        {attemptLoading ? (
          <p className="text-center text-[var(--color-text-secondary)]">Preparing quiz…</p>
        ) : null}

        {!attemptLoading && attemptStartError ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-[var(--color-error)]">{attemptStartError}</p>
            <button
              type="button"
              onClick={() => void runStartAttempt()}
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Try again
            </button>
          </div>
        ) : null}

        {!attemptLoading && !attemptStartError ? (
          total === 0 ? (
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
          )
        ) : null}
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

      {submitError ? (
        <p className="mt-4 text-center text-sm text-[var(--color-error)]" role="alert">
          {submitError}
        </p>
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
              onClick={() => void handleGoOneMoreTime()}
              disabled={attemptLoading}
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-section)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Go one more time
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void handleCheck()}
              disabled={!canSubmit}
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitLoading ? 'Submitting…' : 'Check yourself'}
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
    </>
  );
};

const QuizLessonModal: React.FC<QuizLessonModalProps> = ({
  isOpen,
  onOpenChange,
  courseMaterialId,
  greetingName,
  quizMaterialTitle,
  questions,
  onQuizResult,
}) => {
  const bodyKey = useMemo(
    () => `${courseMaterialId}|${questions.map((q) => q.id).join('|')}`,
    [courseMaterialId, questions],
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={onOpenChange}
      openCloseAnimation
      contentClassName="relative z-[1] flex max-h-[calc(100vh-48px-24px)] w-full max-w-[min(96vw,720px)] flex-col overflow-hidden rounded-[12px] bg-[var(--color-neutral-white)] pt-6 pr-0 pb-6 pl-6 shadow-xl focus:outline-none sm:pl-8 md:pb-10 md:pl-10 lg:pr-0"
    >
      <ModalScrollArea contentGutter>
        <div className="flex flex-col">
          <QuizLessonModalBody
            key={bodyKey}
            courseMaterialId={courseMaterialId}
            greetingName={greetingName}
            quizMaterialTitle={quizMaterialTitle}
            questions={questions}
            onOpenChange={onOpenChange}
            onQuizResult={onQuizResult}
          />
        </div>
      </ModalScrollArea>
    </BaseDialog>
  );
};

export default QuizLessonModal;
