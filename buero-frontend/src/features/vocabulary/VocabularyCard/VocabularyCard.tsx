import React, { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import type { VocabularyWord } from '@/types/features/vocabulary/Vocabulary.types';

type VocabularyCardProps = {
  entry: VocabularyWord;
  onDelete: (id: string) => void;
};

const VocabularyCard: React.FC<VocabularyCardProps> = ({ entry, onDelete }) => {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = flipped ? entry.translation : entry.word;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(entry.id);
  };

  return (
    <div
      className="h-[290px] w-full cursor-pointer [perspective:800px]"
      onClick={() => setFlipped((p) => !p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFlipped((p) => !p);
        }
      }}
      aria-label={flipped ? `Translation: ${entry.translation}` : `Word: ${entry.word}`}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div className="absolute inset-0 flex flex-col rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-5 shadow-sm [backface-visibility:hidden]">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-section)] hover:text-[var(--color-text-primary)]"
              aria-label="Copy word"
            >
              {copied ? (
                <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] transition hover:bg-red-50 hover:text-red-500"
              aria-label="Delete word"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              German Word
            </span>
            <span className="text-center text-2xl font-bold text-[var(--color-neutral-darkest)]">
              {entry.word}
            </span>
            <span className="rounded-full bg-[var(--color-surface-section)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
              {entry.category}
            </span>
          </div>

          <p className="text-center text-xs text-[var(--color-text-secondary)]">Click to flip</p>
        </div>

        <div className="absolute inset-0 flex flex-col rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] p-5 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-section)] hover:text-[var(--color-text-primary)]"
              aria-label="Copy translation"
            >
              {copied ? (
                <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] transition hover:bg-red-50 hover:text-red-500"
              aria-label="Delete word"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Translation
            </span>
            <span className="text-center text-2xl font-bold text-[var(--color-neutral-darkest)]">
              {entry.translation}
            </span>
            <span className="rounded-full bg-[var(--color-surface-section)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
              {entry.category}
            </span>
            {entry.notes ? (
              <p className="mt-1 w-full text-center text-xs italic text-[var(--color-text-secondary)]">
                {entry.notes}
              </p>
            ) : null}
          </div>

          <p className="text-center text-xs text-[var(--color-text-secondary)]">Click to flip</p>
        </div>
      </div>
    </div>
  );
};

export default VocabularyCard;
