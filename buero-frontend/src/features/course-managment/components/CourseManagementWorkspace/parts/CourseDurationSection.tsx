import React from 'react';
import { Icon } from '@/components/ui';

type Props = {
  durationMinutes: number;
  videoLessonsCount: number;
};

const CourseDurationSection: React.FC<Props> = ({ durationMinutes, videoLessonsCount }) => {
  const safeDurationMinutes = Number.isFinite(durationMinutes) ? durationMinutes : 0;
  const safeLessonsCount = Number.isFinite(videoLessonsCount) ? videoLessonsCount : 0;
  const durationHoursPart = Math.floor(safeDurationMinutes / 60);
  const durationMinutesPart = safeDurationMinutes % 60;

  return (
    <section
      aria-label="Course duration and video lessons"
      className="align-items-left mt-6 grid grid-cols-2 gap-4"
    >
      <div className="align-items-left rounded-2xl bg-[var(--color-surface-background)] p-6">
        <p className="text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">
          Duration
        </p>
        <div className="flex items-center gap-3">
          <Icon name="icon-schedule" size={24} className="text-[var(--color-neutral-light)]" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">
            {durationHoursPart}h {durationMinutesPart}m
          </p>
        </div>
      </div>
      <div className="align-items-left rounded-2xl bg-[var(--color-surface-background)] p-6">
        <p className="text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">
          Lessons
        </p>
        <div className="flex items-center gap-3">
          <Icon name="icon-book" size={24} className="text-[var(--color-neutral-light)]" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{safeLessonsCount}</p>
        </div>
      </div>
    </section>
  );
};

export default CourseDurationSection;
