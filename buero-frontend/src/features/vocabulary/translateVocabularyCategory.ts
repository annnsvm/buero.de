import type { TFunction } from 'i18next';
import type { VocabularyCategory } from '@/types/features/vocabulary/Vocabulary.types';

const CATEGORY_KEY: Record<VocabularyCategory, string> = {
  Vocabulary: 'vocabulary.categories.vocabulary',
  Idiom: 'vocabulary.categories.idiom',
  Phrase: 'vocabulary.categories.phrase',
  Grammar: 'vocabulary.categories.grammar',
  Other: 'vocabulary.categories.other',
};

export const translateVocabularyCategory = (
  t: TFunction,
  category: VocabularyCategory | 'All',
): string => {
  if (category === 'All') {
    return t('vocabulary.categories.all');
  }
  return t(CATEGORY_KEY[category]);
};
