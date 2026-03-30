import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VocabularyWord } from '@/types/features/vocabulary/Vocabulary.types';

type VocabularyState = {
  words: VocabularyWord[];
};

const initialState: VocabularyState = {
  words: [],
};

const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {
    addWord(state, action: PayloadAction<VocabularyWord>) {
      state.words.unshift(action.payload);
    },
    deleteWord(state, action: PayloadAction<string>) {
      state.words = state.words.filter((w) => w.id !== action.payload);
    },
  },
});

export const { addWord, deleteWord } = vocabularySlice.actions;
export const vocabularyReducer = vocabularySlice.reducer;
