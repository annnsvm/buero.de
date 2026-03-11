type UiModalType =
  | 'courseInfo'
  | 'contactSupport'
  | 'addVocabulary'
  | 'addVocabularySuccess'
  | 'confirm';

type UiModalPayload =
  | {
      type: 'courseInfo';
      courseId: string;
    }
  | {
      type: 'contactSupport';
      subject?: string;
      courseId?: string;
      prefillEmail?: string;
    }
  | {
      type: 'addVocabulary';
      initialWord?: string;
      initialTranslation?: string;
      categoryId?: string;
    }
  | {
      type: 'addVocabularySuccess';
      word: string;
      translation?: string;
    }
  | {
      type: 'confirm';
      title: string;
      message?: string;
      confirmLabel?: string;
      cancelLabel?: string;
    };

type UIModalStackItem = UiModalPayload;
type UIModalStack = UIModalStackItem[];

export type { UiModalType, UiModalPayload, UIModalStackItem, UIModalStack };
