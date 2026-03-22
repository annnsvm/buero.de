/** Тільки type-only re-export — без `import { store }`, щоб уникнути циклічного імпорту store → rootReducer → api. */
export type { RootState } from '@/redux/rootReducer';
export type { AppDispatch } from '@/redux/store';
