import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const BASE_FILTER_IDS = [
  'all',
  'language',
  'integration',
  'sociocultural',
  'beginner',
  'middle',
  'advanced',
] as const;

const TEACHER_FILTER_IDS = ['published', 'unpublished'] as const;

export type CatalogFilterTab = {
  id: string;
  label: string;
};

export const useCatalogFilterTabs = (role: string | null | undefined): CatalogFilterTab[] => {
  const { t } = useTranslation();

  return useMemo(() => {
    const base = BASE_FILTER_IDS.map((id) => ({
      id,
      label: t(`courses.filters.${id}`),
    }));

    if (role === 'teacher') {
      return [
        ...base,
        ...TEACHER_FILTER_IDS.map((id) => ({
          id,
          label: t(`courses.filters.${id}`),
        })),
      ];
    }

    return base;
  }, [role, t]);
};
