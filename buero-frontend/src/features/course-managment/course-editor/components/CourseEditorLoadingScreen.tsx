import React from 'react';

import { Container } from '@/components/layout';
import { WorkspaceScrollArea } from '@/components/modal';

const ModuleBlockSkeleton = () => (
  <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-background)] p-3">
    <div className="flex items-center justify-between gap-2">
      <div className="h-4 flex-1 rounded-md buero-skeleton-shimmer" />
      <div className="h-8 w-8 shrink-0 rounded-lg buero-skeleton-shimmer" />
    </div>
    <div className="mt-3 space-y-2 border-t border-[var(--color-border-subtle)] pt-3">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-md buero-skeleton-shimmer" />
          <div className="h-3 flex-1 rounded-md buero-skeleton-shimmer" />
        </div>
      ))}
    </div>
    <div className="mt-2 h-8 w-full rounded-lg buero-skeleton-shimmer" />
  </div>
);

const FormFieldCardSkeleton = () => (
  <div className="space-y-3 rounded-2xl bg-[var(--color-surface-background)] p-6">
    <div className="h-4 w-28 rounded-md buero-skeleton-shimmer" />
    <div className="h-11 w-full rounded-[12px] buero-skeleton-shimmer" />
  </div>
);

const CourseEditorLoadingScreen: React.FC = () => (
  <div
    className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]"
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Loading course editor"
  >
    <span className="sr-only">Loading course editor. Please wait.</span>

    <aside
      className="hidden h-full min-h-0 w-[320px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:flex"
      aria-hidden="true"
    >
      <div className="shrink-0 px-26 py-8">
        <div className="h-7 w-[4.5rem] rounded-md buero-skeleton-shimmer" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col pl-4 pt-4 pb-4 pr-0">
        <div className="h-5 w-36 rounded-md buero-skeleton-shimmer" />
        <WorkspaceScrollArea className="mt-2 flex min-h-0 flex-1 flex-col">
          <div className="space-y-3 pr-2">
            <ModuleBlockSkeleton />
            <ModuleBlockSkeleton />
          </div>
        </WorkspaceScrollArea>
        <div className="mt-4 shrink-0 space-y-3 pr-4">
          <div className="h-11 w-full rounded-xl buero-skeleton-shimmer" />
          <div className="h-11 w-full rounded-xl buero-skeleton-shimmer" />
        </div>
      </div>
    </aside>

    <WorkspaceScrollArea className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--color-soapstone-base)]">
      <div className="flex min-w-0 flex-col bg-[var(--color-soapstone-base)]">
      <div className="sticky top-0 z-20 w-full shrink-0 border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
          <div className="h-4 w-28 rounded-md buero-skeleton-shimmer" />
          <div className="h-9 w-24 rounded-full buero-skeleton-shimmer" />
        </div>
        <div className="hidden items-center justify-between gap-4 px-4 py-4 lg:flex lg:px-10">
          <div className="h-6 w-32 rounded-md buero-skeleton-shimmer" />
          <div className="h-10 w-40 shrink-0 rounded-full buero-skeleton-shimmer" />
        </div>
      </div>

      <header className="shrink-0 pt-8">
        <Container className="px-4 sm:px-6">
          <div className="flex w-full flex-col items-center gap-3">
            <div className="h-10 w-[min(100%,420px)] rounded-lg buero-skeleton-shimmer sm:h-12" />
            <div className="h-5 w-[min(100%,520px)] rounded-md buero-skeleton-shimmer" />
          </div>
        </Container>
      </header>

      <div className="py-8">
        <Container className="max-w-[1100px] px-4 sm:px-6">
          <div className="space-y-6">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl buero-skeleton-shimmer"
              aria-hidden="true"
            />

            <div>
              <div className="mb-4 h-4 w-28 rounded-md buero-skeleton-shimmer" />
              <div className="flex flex-col gap-4">
                <FormFieldCardSkeleton />
                <div className="space-y-3 rounded-2xl bg-[var(--color-surface-background)] p-6">
                  <div className="h-4 w-40 rounded-md buero-skeleton-shimmer" />
                  <div className="h-24 w-full rounded-[12px] buero-skeleton-shimmer" />
                </div>
                <FormFieldCardSkeleton />
              </div>
            </div>

            <div className="h-12 w-full max-w-xs rounded-full buero-skeleton-shimmer" />
          </div>
        </Container>
      </div>
      </div>
    </WorkspaceScrollArea>
  </div>
);

export default CourseEditorLoadingScreen;
