import React from 'react';
import { Button, Spinner } from '@/components/ui';

type Props = {
  canCreate: boolean;
  isCreating: boolean;
  createdCourseId: string | null;
  error: string | null;
  onCreateCourse: () => void;
};

const CourseCreateActions: React.FC<Props> = ({
  canCreate,
  isCreating,
  createdCourseId,
  error,
  onCreateCourse,
}) => {
  return (
    <section
      className="rounded-2xl bg-[var(--color-surface-background)] p-6"
      aria-label="Create course actions"
    >
      <div className="flex flex-col flex-wrap items-center justify-between gap-3">
        <div className="min-w-[220px] flex-1 self-start">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Create course</p>
          <p className="mt-1 text-center text-xs text-[var(--color-text-secondary)]">
            After creating the course you can add modules and materials.
          </p>
        </div>

        <Button
          type="button"
          variant="solid"
          onClick={onCreateCourse}
          disabled={!canCreate || isCreating}
        >
          {isCreating ? (
            <span className="inline-flex items-center gap-2">
              <Spinner variant="onPrimary" className="size-5" />
              Creating
            </span>
          ) : createdCourseId ? (
            'Created'
          ) : (
            'Create course'
          )}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default CourseCreateActions;
