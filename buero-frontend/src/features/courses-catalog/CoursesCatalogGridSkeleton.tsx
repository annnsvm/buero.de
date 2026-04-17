import { Container, Section } from '@/components/layout';
import { CreateCourseCard } from '@/features/course-managment';

const PLACEHOLDER_KEYS = ['s0', 's1', 's2', 's3', 's4', 's5'] as const;

export type CoursesCatalogGridSkeletonProps = {
  withTeacherCreateSlot?: boolean;
  sectionClassName?: string;
  loadingLabel?: string;
};

const CoursesCatalogGridSkeleton = ({
  withTeacherCreateSlot = false,
  sectionClassName = '',
  loadingLabel = 'Loading courses',
}: CoursesCatalogGridSkeletonProps) => {
  const sectionClasses = ['pb-28', sectionClassName].filter(Boolean).join(' ');

  return (
    <Section className={sectionClasses} aria-busy="true" aria-label={loadingLabel}>
      <span className="sr-only">{loadingLabel}</span>
      <Container className="md:px-20">
        <ul className="flex flex-wrap justify-start gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16">
          {withTeacherCreateSlot ? (
            <li className="w-[min(100%,405px)] shrink-0">
              <CreateCourseCard />
            </li>
          ) : null}
          {PLACEHOLDER_KEYS.map((key) => (
            <li key={key} className="w-[min(100%,405px)] shrink-0">
              <div className="flex h-full w-full max-w-[405px] min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] shadow-sm">
                <div className="relative aspect-[16/10] w-full overflow-hidden buero-skeleton-shimmer" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-14 rounded-full buero-skeleton-shimmer" />
                  <div className="h-8 w-3/4 rounded-[8px] buero-skeleton-shimmer" />
                  <div className="h-5 w-full rounded-[8px] buero-skeleton-shimmer" />
                  <div className="h-5 w-4/5 rounded-[8px] buero-skeleton-shimmer" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};

export default CoursesCatalogGridSkeleton;
