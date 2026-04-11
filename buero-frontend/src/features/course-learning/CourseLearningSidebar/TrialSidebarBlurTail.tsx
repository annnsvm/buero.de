import React from 'react';
import Icon from '@/components/ui/Icon';
import CheckoutButton from '@/features/subscriptions/components/CheckoutButton';
import { ICON_NAMES } from '@/helpers/iconNames';
import { TrialSidebarBlurTailProps } from '@/types/features/courseManagment';

const TrialSidebarBlurTail: React.FC<TrialSidebarBlurTailProps> = ({
  courseId,
  previewModule = null,
}) => {
  const moduleTitle = previewModule?.title ?? 'More in this course';
  const completedTotal = previewModule != null ? String(previewModule.materialCount) : '?';

  return (
    <div className="relative mt-6 flex min-h-[300px] w-full flex-1 flex-col lg:min-h-[340px]">
      <div
        className="flex w-full items-center justify-between px-2 py-1 text-left opacity-75"
        aria-hidden
      >
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-wider text-[var(--color-neutral-dark)] uppercase">
            MODULE&nbsp;&nbsp;2
          </span>
          <span className="mt-0.5 text-base leading-tight font-semibold text-[var(--color-neutral-darkest)]">
            {moduleTitle}
          </span>
          <span className="mt-0.5 text-sm text-[var(--color-neutral-dark)] opacity-50">
            0/{completedTotal} completed
          </span>
        </div>
        <Icon
          name={ICON_NAMES.CHEVRON_UP}
          size={20}
          className="shrink-0 text-[var(--color-neutral-darkest)]"
        />
      </div>

      <div className="mt-3 flex min-h-[220px] flex-1 flex-col">
        <div className="relative min-h-0 flex-1">
          <div className="pointer-events-none space-y-3 pl-2" aria-hidden>
            <div className="flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left opacity-40">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]"
                aria-hidden
              >
                <Icon name={ICON_NAMES.PLAY_ARROW} size={18} color="var(--color-white)" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-[var(--color-neutral-darkest)]">
                  Lesson
                </span>
                <span className="text-xs text-[var(--color-neutral-dark)]">15:35</span>
              </div>
            </div>
            <div className="flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left opacity-30">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]"
                aria-hidden
              >
                <Icon name={ICON_NAMES.PLAY_ARROW} size={18} color="var(--color-white)" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-[var(--color-neutral-darkest)]">
                  Lesson
                </span>
                <span className="text-xs text-[var(--color-neutral-dark)]">12:56</span>
              </div>
            </div>
            <div className="flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left opacity-20">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]"
                aria-hidden
              >
                <Icon name={ICON_NAMES.HELP} size={18} color="var(--color-white)" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-[var(--color-neutral-darkest)]">
                  Quiz
                </span>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[0%] via-[var(--color-neutral-white)]/45 via-[38%] to-[var(--color-neutral-white)] to-[100%]"
            aria-hidden
          />
        </div>

        <div className="absolute top-30 right-[50%] z-10 flex shrink-0 translate-x-[50%] justify-center px-2 pt-10 pb-6">
          <CheckoutButton
            courseId={courseId}
            label="Unlock full course"
            className="pointer-events-auto w-full max-w-[260px] min-w-[180px] rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-on-accent)] shadow-md hover:bg-[var(--color-primary-hover)] sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default TrialSidebarBlurTail;
