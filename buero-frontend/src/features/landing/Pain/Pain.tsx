import { useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { Container, Section, SectionTitle, Title } from '@/components/layout';
import Reveal from '../shared/Reveal';
import TapHint from '../shared/TapHint';

const CARDS = [
  {
    id: 'freeze',
    titleKey: 'painItem1Title',
    bodyKey: 'painItem1Body',
    tone: 'ink',
  },
  {
    id: 'rule',
    titleKey: 'painItem2Title',
    bodyKey: 'painItem2Body',
    tone: 'coral',
  },
  {
    id: 'chaos',
    titleKey: 'painItem3Title',
    bodyKey: 'painItem3Body',
    tone: 'sand',
  },
] as const;

const TONE_CLASS = {
  ink: 'bg-[var(--color-cod-gray-base)] text-white shadow-[0_18px_40px_rgba(10,10,10,0.18)]',
  coral:
    'bg-[var(--color-burnt-siena-base)] text-white shadow-[0_18px_40px_rgba(231,110,80,0.28)]',
  sand: 'bg-[var(--color-dawn-pink-light)] text-[var(--color-cod-gray-base)] shadow-[0_18px_40px_rgba(1,1,1,0.06)]',
} as const;

const TONE_ACTIVE_SHADOW = {
  ink: 'shadow-[0_26px_56px_rgba(10,10,10,0.32)]',
  coral: 'shadow-[0_26px_56px_rgba(231,110,80,0.42)]',
  sand: 'shadow-[0_26px_56px_rgba(1,1,1,0.14)]',
} as const;

const splitTitle = (title: string) => {
  const dot = title.indexOf('.');
  if (dot < 0) return { first: title, second: '' };
  return {
    first: title.slice(0, dot + 1),
    second: title.slice(dot + 1).trimStart(),
  };
};

const Pain = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<(typeof CARDS)[number]['id'] | null>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const { first: titleFirst, second: titleSecond } = splitTitle(t('landing.painTitle'));

  const moveFocus = (index: number) => {
    buttonsRef.current[index]?.focus();
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = CARDS.length - 1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(index === last ? 0 : index + 1);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(index === 0 ? last : index - 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      moveFocus(last);
    }
  };

  return (
    <Section
      id="pain"
      className="overflow-x-hidden bg-[var(--color-dawn-pink-base)] pt-20 pb-8 sm:pt-16 sm:pb-8"
    >
      <Container>
        <Reveal className="mb-6 max-w-5xl lg:mb-7">
          <SectionTitle label={t('landing.painSection')} className="mb-4">
            {t('landing.painSection')}
          </SectionTitle>
          <Title className="max-w-5xl text-balance lg:!text-[3.75rem]">
            <span className="block">{titleFirst}</span>
            {titleSecond ? <span className="block">{titleSecond}</span> : null}
          </Title>
        </Reveal>

        <ul className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-5">
          {CARDS.map(({ id, titleKey, bodyKey, tone }, index) => {
            const isActive = activeId === id;
            const Icon = isActive ? Minus : Plus;
            const panelId = `pain-card-panel-${id}`;

            return (
              <li key={id} className="min-w-0">
                <Reveal delayMs={index * 90} className="min-w-0">
                  <button
                    ref={(node) => {
                      buttonsRef.current[index] = node;
                    }}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => setActiveId((current) => (current === id ? null : id))}
                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                    className={[
                      'buero-pain-card flex w-full min-w-0 flex-col items-start overflow-x-hidden rounded-[24px] p-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-burnt-siena-base)]',
                      TONE_CLASS[tone],
                      isActive
                        ? `buero-pain-card--active ${TONE_ACTIVE_SHADOW[tone]}`
                        : 'buero-pain-card--idle',
                    ].join(' ')}
                  >
                    <span className="flex w-full items-start justify-between gap-3">
                      <span
                        className={[
                          'text-[0.75rem] font-bold tracking-[0.16em] uppercase',
                          tone === 'sand' ? 'text-[var(--color-burnt-siena-dark)]' : 'text-white/70',
                        ].join(' ')}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <Icon
                        size={20}
                        strokeWidth={2.25}
                        aria-hidden
                        className={
                          tone === 'sand'
                            ? 'shrink-0 text-[var(--color-burnt-siena-dark)]'
                            : 'shrink-0 text-white/85'
                        }
                      />
                    </span>
                    <span className="mt-5 w-full min-w-0 text-wrap break-words font-[family-name:var(--font-heading)] text-[1.35rem] leading-[1.25] font-semibold tracking-[-0.03em] sm:text-[1.5rem]">
                      {t(`landing.${titleKey}`)}
                    </span>
                    <span
                      id={panelId}
                      className={[
                        'grid w-full min-w-0 transition-[grid-template-rows,opacity] duration-300 ease-out',
                        isActive ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      ].join(' ')}
                    >
                      <span className="min-w-0 overflow-hidden">
                        <span
                          className={[
                            'block min-w-0 text-wrap break-words text-[1rem] leading-[1.5]',
                            tone === 'sand'
                              ? 'text-[var(--color-text-primary)]'
                              : 'text-white/85',
                          ].join(' ')}
                        >
                          {t(`landing.${bodyKey}`)}
                        </span>
                      </span>
                    </span>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-[0.95rem] text-[var(--color-text-secondary)]">
          {t('landing.painHint')}
          <TapHint visible emoji="👆" />
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-center font-[family-name:var(--font-heading)] text-[1.05rem] leading-[1.45] font-semibold text-[var(--color-cod-gray-base)] sm:mt-6 sm:text-[1.15rem]">
          {t('landing.painClosing')}
        </p>
      </Container>
    </Section>
  );
};

export default Pain;
