
export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text?: string;
  correct: string | string[];
  options?: QuizQuestionOption[];
}

export interface QuizBlock {
  questions: QuizQuestion[];
}

export interface QuizContent {
  blocks: QuizBlock[];
}

export interface QuizContentFlat {
  questions: QuizQuestion[];
}

export type QuizContentAny = QuizContent | QuizContentFlat;

export interface QuizAnswerSnapshotItem {
  question_id: string;
  answer: string | string[];
}
