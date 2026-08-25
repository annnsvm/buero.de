import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Volume2 } from 'lucide-react';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import AnimatedProgressBar from '../shared/AnimatedProgressBar';
import AssetImage from '../shared/AssetImage';
import Reveal from '../shared/Reveal';

const POSTER_SRC = '/assets/platform/platform-video-placeholder.jpg';

type PlatformPreviewProps = {
  videoSrc?: string;
};

const LESSONS = [
  { titleKey: 'platformLesson1', duration: '04:32', done: true },
  { titleKey: 'platformLesson2', duration: '07:15', done: true },
  { titleKey: 'platformLesson3', duration: '03:48', done: false },
  { titleKey: 'platformLesson4', duration: '05:20', done: false },
] as const;

const PlatformDashboard = () => {
  const { t } = useTranslation();

  return (
    <div
      className="absolute inset-0 bg-[var(--color-cod-gray-base)] text-[var(--color-neutral-white)]"
      aria-hidden="true"
    >
      <div className="flex h-full">
        <aside className="hidden w-[34%] flex-col border-r border-white/10 p-5 sm:flex lg:p-6">
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-[var(--color-burnt-siena-light)] uppercase">
            {t('landing.platformCourseLabel')}
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-[1.15rem] font-semibold">
            {t('landing.platformCourseName')}
          </p>
          <p className="mt-1 text-[0.85rem] text-white/55">{t('landing.platformModule')}</p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[0.8rem] text-white/60">
              <span>{t('landing.platformProgressLabel')}</span>
              <span>42%</span>
            </div>
            <AnimatedProgressBar
              value={42}
              delayMs={220}
              trackClassName="h-1.5 rounded-full bg-white/10"
              fillClassName="rounded-full bg-[var(--color-burnt-siena-base)]"
            />
          </div>

          <ul className="mt-6 flex flex-col gap-2">
            {LESSONS.map((lesson) => (
              <li
                key={lesson.titleKey}
                className={[
                  'flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[0.85rem]',
                  lesson.done ? 'bg-white/8' : 'bg-[var(--color-burnt-siena-base)]/25',
                ].join(' ')}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {lesson.done ? (
                    <Check size={14} className="shrink-0 text-[var(--color-burnt-siena-light)]" />
                  ) : (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-burnt-siena-light)]" />
                  )}
                  <span className="truncate">{t(`landing.${lesson.titleKey}`)}</span>
                </span>
                <span className="shrink-0 tabular-nums text-white/45">{lesson.duration}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[0.8rem] text-white/70">
            <Volume2 size={14} />
            {t('landing.platformVocabHint')}
          </div>
        </aside>

        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
            {t('landing.platformNowPlaying')}
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-[1.25rem] font-semibold sm:text-[1.5rem]">
            {t('landing.platformLesson3')}
          </p>
          <p className="mt-1 text-[0.9rem] text-white/50">03:48</p>
          <div className="mt-5 flex-1 rounded-2xl bg-white/8" />
          <AnimatedProgressBar
            value={28}
            delayMs={320}
            className="mt-4"
            trackClassName="h-1.5 rounded-full bg-white/10"
            fillClassName="rounded-full bg-white/50"
          />
        </div>
      </div>
    </div>
  );
};

const PlatformPreview = ({ videoSrc }: PlatformPreviewProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play();
    setPlaying(true);
  };

  return (
    <Section className="bg-[var(--color-soapstone-base)] py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTitle label={t('landing.platformSection')} className="mb-4">
            {t('landing.platformSection')}
          </SectionTitle>
          <Title className="mb-6">{t('landing.platformTitle')}</Title>
          <Text label={t('landing.platformSubtitle')} className="mx-auto max-w-[640px]">
            {t('landing.platformSubtitle')}
          </Text>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[24px] border border-[var(--opacity-neutral-darkest-15)] shadow-[0_24px_60px_rgba(1,1,1,0.12)] transition-transform duration-500 hover:-translate-y-1 sm:mt-12">
            <div className="relative aspect-[16/10] w-full bg-[var(--color-dawn-pink-base)] sm:aspect-video">
              {videoSrc ? (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover object-top"
                  poster={POSTER_SRC}
                  controls={playing}
                  playsInline
                  onEnded={() => setPlaying(false)}
                >
                  <source src={videoSrc} />
                </video>
              ) : (
                <AssetImage
                  src={POSTER_SRC}
                  alt={t('landing.platformPreviewAlt')}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  fallback={<PlatformDashboard />}
                />
              )}

              {!playing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-black/45 via-black/20 to-black/10">
                  <p className="rounded-full border border-white/30 bg-black/35 px-4 py-1 text-[0.75rem] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-[2px]">
                    {t('landing.platformWalkthrough')}
                  </p>
                  <button
                    type="button"
                    onClick={handlePlay}
                    disabled={!videoSrc}
                    aria-label={
                      videoSrc ? t('landing.platformPlay') : t('landing.platformComingSoon')
                    }
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-burnt-siena-base)] text-white shadow-[0_8px_30px_rgba(231,110,80,0.45)] transition-transform duration-200 hover:scale-105 disabled:cursor-default sm:h-20 sm:w-20"
                  >
                    <Icon name={ICON_NAMES.PLAY_ARROW} size={32} color="var(--color-white)" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};

export default PlatformPreview;
