import React from 'react';
import { BookOpen, CircleHelp, FileText, Flame, SkipForward, Trophy } from 'lucide-react';

import { Container, Text, Title } from '@/components/layout';
import { lessonContent } from './MaterialWindow.data';
import type { LearningPageProps } from '@/types/features/learning/LearningPage.types';

const MaterialWindow: React.FC<LearningPageProps> = ({ lesson = lessonContent }) => {
  return (
    <main className="flex-1 bg-[var(--color-soapstone-base)] py-4 sm:py-6 lg:py-8">
      <Container className="max-w-5xl">
        <section className="rounded-[20px] bg-[var(--color-neutral-white)] p-4 shadow-sm sm:rounded-[22px] sm:p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8e5df] text-[#e87753] sm:h-11 sm:w-11">
                <Trophy className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1b1b1b] sm:text-base lg:text-lg">
                  {lesson.courseTitle}
                </p>
                <p className="text-xs text-[#6f6865] sm:text-sm lg:text-[15px]">
                  {lesson.progressText}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 lg:min-w-[320px] lg:items-end">
              <div className="flex items-center gap-2 text-xs text-[#6f6865] sm:text-sm lg:text-[15px]">
                <Flame className="h-4 w-4 text-[#e87753]" />
                <span>{lesson.streak}</span>
              </div>

              <div className="flex w-full items-center gap-2 sm:gap-3 lg:max-w-[260px]">
                <div className="h-1.5 flex-1 rounded-full bg-[#eedad2]">
                  <div
                    className="h-1.5 rounded-full bg-[#e87753]"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs text-[#6f6865] sm:text-sm lg:text-[15px]">
                  {lesson.progress}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 sm:mt-5 md:mt-6">
          <div className="overflow-hidden rounded-[20px] bg-[#8f8f8f] sm:rounded-[22px]">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={lesson.videoUrl}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="mt-6 sm:mt-8 md:mt-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#e87753] px-3 py-1 text-[11px] font-semibold text-white sm:text-xs">
              {lesson.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d7cbc5] px-3 py-1 text-[11px] font-medium text-[#5f5854] sm:text-xs">
              <FileText className="h-3.5 w-3.5" />
              {lesson.status}
            </span>
          </div>

          <Title className="mt-4 sm:mt-5">{lesson.title}</Title>

          <Text label="Lesson description" className="mt-3 max-w-4xl sm:mt-4">
            {lesson.description}
          </Text>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
            >
              Mark as complete
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d7cbc5] bg-transparent px-5 py-3 text-sm font-medium text-[#5f5854] transition hover:bg-white/40 sm:w-auto"
            >
              Next lesson
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-[20px] bg-[var(--color-neutral-white)] p-4 shadow-sm sm:mt-8 sm:rounded-[22px] sm:p-5 md:mt-10 md:p-6">
          <h2 className="text-xl font-semibold text-[#56504c] sm:text-2xl md:text-[2rem]">
            Lesson Notes
          </h2>

          <textarea
            placeholder="Take your notes here..."
            className="mt-4 min-h-[120px] w-full rounded-lg border border-[#cfc4be] bg-[var(--color-neutral-white)] px-4 py-3 text-sm text-[#1f1c1a] outline-none placeholder:text-[#75706c] focus:border-[#b8aaa1] sm:min-h-[132px]"
          />
        </section>

        <div className="mt-4 sm:mt-5 md:mt-6">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d7cbc5] bg-transparent px-5 py-3 text-sm font-medium text-[#5f5854] transition hover:bg-white/40 sm:w-auto"
          >
            <BookOpen className="h-4 w-4" />
            Add Unknown Word
          </button>
        </div>

        <section className="mt-6 rounded-[20px] border border-dashed border-[#e87753] p-5 sm:mt-8 sm:rounded-[22px] sm:p-7 md:mt-10 md:p-10">
          <Title className="text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem]">
            Need clarification?
          </Title>

          <Text label="Clarification description" className="mt-3 max-w-3xl text-[#5f5854] sm:mt-4">
            Book a 1-on-1 session with our instructors if something feels unclear. Get personalized
            guidance and answers to your specific questions.
          </Text>

          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e87753] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:mt-6 sm:w-auto"
          >
            <CircleHelp className="h-4 w-4" />
            Book 1-on-1 Session
          </button>
        </section>
      </Container>
    </main>
  );
};

export default MaterialWindow;
