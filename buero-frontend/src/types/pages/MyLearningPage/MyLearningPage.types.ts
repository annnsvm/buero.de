export type MyLearningLoadStatus = 'idle' | 'loading' | 'error';

export type MyLearningCatalogFilterTabId =
  | 'all'
  | 'language'
  | 'integration'
  | 'sociocultural';

export type MyLearningCatalogFilterTab = {
  id: MyLearningCatalogFilterTabId;
  label: string;
};
