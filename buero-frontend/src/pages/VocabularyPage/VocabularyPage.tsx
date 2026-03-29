import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Container } from '@/components/layout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteWord } from '@/redux/slices/vocabulary/vocabularySlice';
import VocabularyCard from '@/features/vocabulary/VocabularyCard/VocabularyCard';
import type { VocabularyCategory } from '@/types/features/vocabulary/Vocabulary.types';

const ALL_CATEGORIES: Array<VocabularyCategory | 'All'> = [
  'All',
  'Vocabulary',
  'Idiom',
  'Phrase',
  'Grammar',
  'Other',
];

const VocabularyPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useAppDispatch();
  const words = useAppSelector((s) => s.vocabulary.words);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<VocabularyCategory | 'All'>('All');

  const filtered = useMemo(() => {
    let result = words;
    if (activeCategory !== 'All') {
      result = result.filter((w) => w.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q),
      );
    }
    return result;
  }, [words, activeCategory, search]);

  const handleDelete = (id: string) => {
    dispatch(deleteWord(id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-section)] pb-16 pt-8">
      <Container className="max-w-6xl">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to lesson
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-[var(--color-neutral-darkest)] sm:text-4xl">
          Vocabulary
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-secondary)]">
          Practice your saved German words. Click cards to flip and see translations.
        </p>

        {words.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            {/* German flag SVG */}
            <svg
              className="h-24 w-32"
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="120" height="26.67" rx="4" fill="#000" />
              <rect y="26.67" width="120" height="26.67" fill="#DD0000" />
              <rect y="53.33" width="120" height="26.67" rx="4" fill="#FFCC00" />
            </svg>

            <h2 className="mt-6 text-xl font-semibold text-[var(--color-neutral-darkest)]">
              No Words Yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
              Start adding German words from your lessons to build your vocabulary. Click
              &ldquo;Add Unknown Word&rdquo; while learning.
            </p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search words..."
                className="w-full rounded-xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] py-3 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
              />
            </div>

            {/* Category filters */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[var(--color-neutral-darkest)]">
                Categories
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeCategory === cat
                        ? 'bg-[var(--color-cod-gray-base)] text-white'
                        : 'border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-section)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((w) => (
                <VocabularyCard key={w.id} entry={w} onDelete={handleDelete} />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="mt-10 text-center text-sm text-[var(--color-text-secondary)]">
                No words match your search or filter.
              </p>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default VocabularyPage;
