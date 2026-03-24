import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { BookOpen, CircleHelp, FileText, Flame, Play, SkipForward, Trophy } from 'lucide-react';

import { Container, Text, Title } from '@/components/layout';
import { loadYoutubeIframeApi } from '@/helpers/youtubeIframeApi';
import { lessonContent } from './MaterialWindow.data';
import type { LearningPageProps } from '@/types/features/learning/LearningPage.types';

const extractYouTubeEmbedVideoId = (embedUrl: string): string | null => {
  const m = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
};

const buildAutoplayEmbedSrc = (embedUrl: string): string => {
  const hasQuery = embedUrl.includes('?');
  return `${embedUrl}${hasQuery ? '&' : '?'}autoplay=1`;
};

type LazyYouTubeEmbedProps = {
  videoUrl: string;
  title: string;
  onVideoEnded?: () => void;
  fallbackMarkReadyAfterSeconds?: number | null;
};

const LazyYouTubeEmbed: React.FC<LazyYouTubeEmbedProps> = ({
  videoUrl,
  title,
  onVideoEnded,
  fallbackMarkReadyAfterSeconds,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [usePlainIframe, setUsePlainIframe] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<{ destroy: () => void } | undefined>(undefined);
  const hostId = useId().replace(/:/g, '');
  const onEndedRef = useRef(onVideoEnded);
  const endedEmittedRef = useRef(false);

  const videoId = useMemo(() => extractYouTubeEmbedVideoId(videoUrl), [videoUrl]);
  const posterSrc = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  useEffect(() => {
    onEndedRef.current = onVideoEnded;
  }, [onVideoEnded]);

  const signalEnded = useCallback(() => {
    if (endedEmittedRef.current) return;
    endedEmittedRef.current = true;
    onEndedRef.current?.();
  }, []);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || usePlainIframe || !videoId) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let cancelled = false;
    const host = document.createElement('div');
    host.id = `yt-host-${hostId}`;
    host.style.width = '100%';
    host.style.height = '100%';
    wrapper.appendChild(host);

    const clearHost = () => {
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = undefined;
      wrapper.innerHTML = '';
    };

    const failToIframe = () => {
      if (!cancelled) {
        clearHost();
        setUsePlainIframe(true);
      }
    };

    void loadYoutubeIframeApi()
      .then(() => {
        if (cancelled || !window.YT?.Player || !window.YT.PlayerState) {
          failToIframe();
          return;
        }
        try {
          const player = new window.YT.Player(host, {
            videoId,
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
            },
            events: {
              onStateChange: (event: { data: number }) => {
                if (event.data === window.YT!.PlayerState.ENDED) {
                  signalEnded();
                }
              },
            },
          });
          if (cancelled) {
            try {
              player.destroy();
            } catch {
              /* noop */
            }
            wrapper.innerHTML = '';
            return;
          }
          playerRef.current = player;
        } catch {
          failToIframe();
        }
      })
      .catch(() => {
        failToIframe();
      });

    return () => {
      cancelled = true;
      clearHost();
    };
  }, [isPlaying, usePlainIframe, videoId, hostId, signalEnded]);

  useEffect(() => {
    if (!isPlaying || !usePlainIframe) return;
    const sec = fallbackMarkReadyAfterSeconds;
    if (sec == null || sec < 1) return;
    const t = window.setTimeout(() => signalEnded(), sec * 1000);
    return () => window.clearTimeout(t);
  }, [isPlaying, usePlainIframe, fallbackMarkReadyAfterSeconds, signalEnded]);

  if (isPlaying && usePlainIframe) {
    return (
      <iframe
        className="h-full w-full"
        src={buildAutoplayEmbedSrc(videoUrl)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  if (isPlaying) {
    return (
      <div
        ref={wrapperRef}
        className="h-full w-full min-h-[200px]"
        title={title}
        aria-label={title}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlayClick}
      className="group relative flex h-full w-full items-center justify-center bg-[#2a2a2a] outline-none focus-visible:ring-2 focus-visible:ring-[#e87753] focus-visible:ring-offset-2"
      aria-label={`Play video: ${title}`}
    >
      {posterSrc ? (
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <span
        className="absolute inset-0 bg-black/35 transition group-hover:bg-black/45"
        aria-hidden
      />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#e87753] text-white shadow-lg transition group-hover:scale-105 group-hover:opacity-95 sm:h-20 sm:w-20">
        <Play className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10" strokeWidth={0} aria-hidden />
      </span>
    </button>
  );
};

const MaterialWindow: React.FC<LearningPageProps> = ({
  lesson = lessonContent,
  hasNextVideoLesson = false,
  onNextVideoLesson,
  isVideoLessonCompleted = false,
  onMarkVideoComplete,
  isVideoCompletionSaving = false,
  videoCompletionError = null,
  fallbackMarkReadyAfterSeconds = null,
}) => {
  const [videoEnded, setVideoEnded] = useState(false);

  const isVideoLesson = String(lesson.type).toLowerCase() === 'video';

  const handleVideoEnded = useCallback(() => {
    setVideoEnded(true);
  }, []);

  const handleNextVideoLessonClick = () => {
    if (!hasNextVideoLesson || !onNextVideoLesson) return;
    onNextVideoLesson();
  };

  const handleMarkCompleteClick = () => {
    if (!onMarkVideoComplete || isVideoCompletionSaving || isVideoLessonCompleted) return;
    void onMarkVideoComplete();
  };

  const lessonStatusLabel = isVideoLesson
    ? isVideoLessonCompleted
      ? 'Completed'
      : 'In progress'
    : lesson.status;

  const markButtonDisabled = isVideoCompletionSaving || !videoEnded;

  return (
    <article className="flex-1 bg-[var(--color-surface-section)] py-31" aria-label={lesson.title}>
      <Container className="max-w-5xl px-6 lg:px-12">
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

            <div className="flex flex-row gap-3 sm:gap-4 lg:min-w-[320px] lg:items-end">
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

        <section className="mt-6 bg-[var(--color-neutral-white)] sm:mt-5 md:mt-12">
          <div className="overflow-hidden rounded-[20px] bg-[#8f8f8f] sm:rounded-[22px]">
            <div className="aspect-video w-full">
              <LazyYouTubeEmbed
                key={lesson.materialId ?? lesson.videoUrl}
                videoUrl={lesson.videoUrl}
                title={lesson.title}
                onVideoEnded={isVideoLesson ? handleVideoEnded : undefined}
                fallbackMarkReadyAfterSeconds={fallbackMarkReadyAfterSeconds}
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
              {lessonStatusLabel}
            </span>
          </div>

          <Title className="mt-4 sm:mt-5">{lesson.title}</Title>

          <Text label="Lesson description" className="mt-3 max-w-4xl sm:mt-4">
            {lesson.description}
          </Text>

          {videoCompletionError ? (
            <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
              {videoCompletionError}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
            {isVideoLesson && onMarkVideoComplete && !isVideoLessonCompleted ? (
              <button
                type="button"
                onClick={handleMarkCompleteClick}
                disabled={markButtonDisabled}
                aria-label="Mark as complete"
                className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
              >
                {isVideoCompletionSaving ? 'Saving…' : 'Mark as complete'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleNextVideoLessonClick}
              disabled={!hasNextVideoLesson}
              aria-label={
                hasNextVideoLesson
                  ? 'Go to next video lesson'
                  : 'No more video lessons in this course'
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d7cbc5] bg-transparent px-5 py-3 text-sm font-medium text-[#5f5854] transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              Next lesson
              <SkipForward className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-[20px] bg-[var(--color-neutral-white)] p-6 shadow-sm sm:mt-8 sm:rounded-[22px] md:mt-10">
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
    </article>
  );
};

export default MaterialWindow;
