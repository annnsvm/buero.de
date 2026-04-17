import React from 'react';

import { Container } from '@/components/layout';
import { WorkspaceScrollArea } from '@/components/modal';

const SidebarModuleSkeleton = () => (
  <div className="space-y-4 border-b border-[var(--color-border-subtle)] pb-4 last:border-b-0">
    <div className="h-4 w-2/3 rounded-md buero-skeleton-shimmer" />
    <div className="space-y-2 pl-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-lg buero-skeleton-shimmer" />
          <div className="h-3.5 flex-1 rounded-md buero-skeleton-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

const CoursePageSkeleton: React.FC = () => {
  return (
    <div
      className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading course"
    >
      <span className="sr-only">Loading course. Please wait.</span>

      <aside
        className="hidden h-full min-h-0 w-[320px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:flex"
        aria-hidden="true"
      >
        <div className="shrink-0 px-6 py-6">
          <div className="h-7 w-[4.5rem] rounded-md buero-skeleton-shimmer" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col pl-4 pb-4 pr-0">
          <WorkspaceScrollArea className="flex min-h-0 flex-1 flex-col">
            <div className="space-y-6 pt-2 pr-2">
              <SidebarModuleSkeleton />
              <SidebarModuleSkeleton />
            </div>
          </WorkspaceScrollArea>
        </div>
      </aside>

      <WorkspaceScrollArea className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="min-w-0 flex-col">
        <div className="sticky top-0 z-20 w-full border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
            <div className="h-4 w-28 rounded-md buero-skeleton-shimmer" />
            <div className="h-9 w-24 rounded-full buero-skeleton-shimmer" />
          </div>
          <div className="hidden items-center justify-between gap-4 px-4 py-4 lg:flex lg:px-10">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
              <div className="h-5 w-24 rounded-md buero-skeleton-shimmer" />
              <div className="h-5 w-28 rounded-md buero-skeleton-shimmer" />
              <div className="h-4 w-32 rounded-md buero-skeleton-shimmer" />
            </div>
            <div className="h-10 w-40 shrink-0 rounded-full buero-skeleton-shimmer" />
          </div>
        </div>

        <section
          className="min-w-0 flex-1 bg-[var(--color-soapstone-base)]"
          aria-hidden="true"
        >
          <div className="flex-1 py-8 md:py-12">
            <Container className="max-w-5xl px-6 lg:px-12">
              <div className="rounded-[20px] bg-[var(--color-neutral-white)] p-4 shadow-sm sm:rounded-[22px] sm:p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl buero-skeleton-shimmer sm:h-11 sm:w-11" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-40 rounded-md buero-skeleton-shimmer sm:h-5 sm:w-48" />
                      <div className="h-3 w-56 rounded-md buero-skeleton-shimmer sm:w-64" />
                    </div>
                  </div>
                  <div className="flex w-full flex-row gap-3 sm:gap-4 lg:min-w-[320px] lg:max-w-[320px] lg:items-end">
                    <div className="h-1.5 flex-1 rounded-full buero-skeleton-shimmer" />
                    <div className="h-4 w-8 shrink-0 rounded-md buero-skeleton-shimmer" />
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-[var(--color-neutral-white)] sm:mt-6 md:mt-8">
                <div className="overflow-hidden rounded-[20px] sm:rounded-[22px]">
                  <div className="aspect-video w-full buero-skeleton-shimmer" />
                </div>
              </div>

              <div className="mt-6 sm:mt-8 md:mt-10">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-7 w-16 rounded-full buero-skeleton-shimmer" />
                  <div className="h-7 w-24 rounded-full buero-skeleton-shimmer" />
                </div>
                <div className="mt-4 h-9 w-4/5 max-w-xl rounded-lg buero-skeleton-shimmer sm:mt-5" />
                <div className="mt-3 space-y-2 sm:mt-4">
                  <div className="h-4 w-full max-w-3xl rounded-md buero-skeleton-shimmer" />
                  <div className="h-4 w-full max-w-2xl rounded-md buero-skeleton-shimmer" />
                  <div className="h-4 w-2/3 max-w-xl rounded-md buero-skeleton-shimmer" />
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
                  <div className="h-12 w-full rounded-full buero-skeleton-shimmer sm:w-44" />
                  <div className="h-12 w-full rounded-full buero-skeleton-shimmer sm:w-40" />
                </div>
              </div>

              <div className="mt-6 rounded-[20px] bg-[var(--color-neutral-white)] p-6 shadow-sm sm:mt-8 sm:rounded-[22px] md:mt-10">
                <div className="h-7 w-40 rounded-lg buero-skeleton-shimmer sm:h-8 sm:w-48" />
                <div className="mt-4 min-h-[120px] w-full rounded-lg buero-skeleton-shimmer sm:min-h-[132px]" />
              </div>
            </Container>
          </div>
        </section>
        </div>
      </WorkspaceScrollArea>
    </div>
  );
};

export default CoursePageSkeleton;
