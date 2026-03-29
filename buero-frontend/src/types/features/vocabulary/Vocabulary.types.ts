type VocabularyCategory = 'Vocabulary' | 'Idiom' | 'Phrase' | 'Grammar' | 'Other';

type VocabularyWord = {
  id: string;
  word: string;
  translation: string;
  category: VocabularyCategory;
  notes?: string;
  createdAt: string;
};

export type { VocabularyCategory, VocabularyWord };
