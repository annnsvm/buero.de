import React from 'react';
import type { CourseAsideActionButtonProps } from '@/types/features/courseManagment/CourseStructureAside.types';
import { Line } from '@/components/ui';

const CourseStructureAsideActionButton: React.FC<CourseAsideActionButtonProps> = ({
  label,
  ariaLabel,
  onClick,
  onAfterClick,
  className = '',
}) => {
  const handleAction = () => {
    onClick();
    onAfterClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    handleAction();
  };

  return (
    <>
      <Line />
      <button
        type="button"
        onClick={handleAction}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        className={`mt-4 flex w-full items-center gap-3 rounded-2xl bg-[var(--color-surface-card)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-overlay)] ${className}`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-[1.2rem] leading-none font-bold text-white">
          +
        </span>
        <span className="text-sm leading-none font-bold text-[var(--color-text-primary)]">
          {label}
        </span>
      </button>
    </>
  );
};

export default CourseStructureAsideActionButton;
