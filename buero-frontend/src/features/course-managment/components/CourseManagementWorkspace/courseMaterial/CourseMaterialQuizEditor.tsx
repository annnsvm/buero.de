import React from 'react';
import { Icon, Line } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { CourseMaterialQuizEditorProps } from '@/types/features/courseManagment/CourseMaterialQuizEditor.types';
import { createDefaultQuizQuestion, createLocalId } from './helpers/courseMaterialInitialState';

const CourseMaterialQuizEditor: React.FC<CourseMaterialQuizEditorProps> = ({
  quizQuestions,
  isSubmitting,
  onQuizQuestionsChange,
  onRemoveQuestion,
  onRemoveAnswer,
}) => {
  const handleDeleteQuestionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    questionId: string,
  ) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onRemoveQuestion(questionId);
  };

  const handleDeleteAnswerKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    questionId: string,
    answerId: string,
  ) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onRemoveAnswer(questionId, answerId);
  };

  return (
    <div className="min-w-0 w-full max-w-full space-y-10 overflow-x-hidden">
      {quizQuestions.map((questionItem, qIdx) => (
        <div key={questionItem.id} className="min-w-0 w-full max-w-full space-y-6">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <p className="text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">
              Question {qIdx + 1}
            </p>
            <button
              type="button"
              onClick={() => onRemoveQuestion(questionItem.id)}
              onKeyDown={(e) => handleDeleteQuestionKeyDown(e, questionItem.id)}
              disabled={isSubmitting || quizQuestions.length <= 1}
              aria-label={`Delete question ${qIdx + 1}`}
              className="shrink-0 rounded-lg p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-section)] hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name={ICON_NAMES.TRASH} size={20} className="text-current" ariaHidden />
            </button>
          </div>
          <div className="min-w-0 w-full max-w-full">
            <p className="text-base font-bold text-[var(--color-text-primary)]">Your question?</p>
            <input
              id={`quizQuestionTab_${questionItem.id}`}
              type="text"
              placeholder="Put the question here, it should appear above"
              value={questionItem.question}
              onChange={(e) =>
                onQuizQuestionsChange((prev) =>
                  prev.map((q) =>
                    q.id === questionItem.id ? { ...q, question: e.target.value } : q,
                  ),
                )
              }
              disabled={isSubmitting}
              className="mt-2 box-border min-w-0 w-full max-w-full border-0 border-b border-[var(--color-border-default)] bg-transparent py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              aria-label={`Quiz question ${qIdx + 1}`}
            />
          </div>

          <div className="box-border min-w-0 w-full max-w-full pl-4 sm:pl-8">
            <div className="space-y-6">
              {questionItem.answers.map((answerItem, answerIdx) => {
                const letter = String.fromCharCode(97 + answerIdx);
                return (
                  <div key={answerItem.id} className="flex min-w-0 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={answerItem.isCorrect}
                      onChange={(e) =>
                        onQuizQuestionsChange((prev) =>
                          prev.map((q) =>
                            q.id === questionItem.id
                              ? {
                                  ...q,
                                  answers: q.answers.map((answer) =>
                                    answer.id === answerItem.id
                                      ? { ...answer, isCorrect: e.target.checked }
                                      : answer,
                                  ),
                                }
                              : q,
                          ),
                        )
                      }
                      disabled={isSubmitting}
                      className="mt-1 size-5 shrink-0 cursor-pointer rounded border-2 border-[var(--color-border-default)] accent-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                      aria-label={`Mark answer ${letter} as correct for question ${qIdx + 1}`}
                    />
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {letter}) answer
                      </p>
                      <input
                        id={`quizAnswerTab_${questionItem.id}_${answerIdx}`}
                        type="text"
                        placeholder="Put the answer here, it should appear above"
                        value={answerItem.text}
                        onChange={(e) =>
                          onQuizQuestionsChange((prev) =>
                            prev.map((q) =>
                              q.id === questionItem.id
                                ? {
                                    ...q,
                                    answers: q.answers.map((answer) =>
                                      answer.id === answerItem.id
                                        ? { ...answer, text: e.target.value }
                                        : answer,
                                    ),
                                  }
                                : q,
                            ),
                          )
                        }
                        disabled={isSubmitting}
                        className="mt-1 box-border min-w-0 w-full max-w-full border-0 border-b border-[var(--color-border-default)] bg-transparent py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label={`Answer ${letter} for question ${qIdx + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveAnswer(questionItem.id, answerItem.id)}
                      onKeyDown={(e) => handleDeleteAnswerKeyDown(e, questionItem.id, answerItem.id)}
                      disabled={isSubmitting || questionItem.answers.length <= 2}
                      aria-label={`Delete answer ${letter} for question ${qIdx + 1}`}
                      className="mt-1 shrink-0 rounded-lg p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-section)] hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon name={ICON_NAMES.TRASH} size={18} className="text-current" ariaHidden />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex w-full min-w-0 justify-center">
            <button
              type="button"
              onClick={() =>
                onQuizQuestionsChange((prev) =>
                  prev.map((q) =>
                    q.id === questionItem.id
                      ? {
                          ...q,
                          answers: [
                            ...q.answers,
                            { id: createLocalId('opt'), text: '', isCorrect: false },
                          ],
                        }
                      : q,
                  ),
                )
              }
              disabled={isSubmitting}
              className="inline-flex min-w-0 items-center justify-center gap-3 rounded-2xl bg-transparent py-2 text-left transition-colors hover:bg-[var(--color-surface-section)] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Add another answer"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-[1.2rem] leading-none font-bold text-white">
                +
              </span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                Add another answer
              </span>
            </button>
          </div>
        </div>
      ))}

      <div className="min-w-0 w-full max-w-full">
        <div className="min-w-0 w-full max-w-full py-2">
          <Line />
        </div>
        <div className="flex w-full min-w-0 justify-center pb-1">
          <button
            type="button"
            onClick={() => onQuizQuestionsChange((prev) => [...prev, createDefaultQuizQuestion()])}
            disabled={isSubmitting}
            className="inline-flex min-w-0 items-center justify-center gap-3 rounded-2xl bg-transparent py-3 text-left transition-colors hover:bg-[var(--color-surface-section)] disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Add another question"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-[1.2rem] leading-none font-bold text-white">
              +
            </span>
            <span className="text-sm font-bold text-[var(--color-text-primary)]">
              Add another question
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterialQuizEditor;
