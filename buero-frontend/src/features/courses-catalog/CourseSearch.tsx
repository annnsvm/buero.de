import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CourseSearchProps } from '@/types/features/courses-catalog/CourseSearch.types';
import Icon from '@/components/ui/Icon';
const DEBOUNCE_MS = 400;

const CourseSearch: React.FC<CourseSearchProps> = ({ onSearch, initialSearch = '' }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      e.currentTarget.blur(); 
    }
  };
  return (
    <div className="w-full max-w-[560px]">
      <div className="relative h-[43px]">
        <span className="absolute inset-y-0 left-3 flex items-center text-[var(--opacity-white-60)] pointer-events-none">
          <Icon name='icon-search' size={24} className="text-[var(--opacity-white-60)]"/>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('courses.searchPlaceholder')}
          className="h-full w-full rounded-[12px] border border-[var(--opacity-white-60)] bg-[var(--opacity-neutral-darkest-15)] pl-10 pr-3 text-lg leading-[1.5] py-2 text-[var(--color-white)] placeholder:text-[var(--opacity-white-60)] shadow-2xl focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
        />
      </div>
    </div>
  );
};

export default CourseSearch;
