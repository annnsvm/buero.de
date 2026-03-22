import React, { useState, useEffect } from 'react';
import type { CourseSearchProps } from '@/types/features/courses-catalog/CourseSearch.types';
import Icon from '@/components/ui/Icon';
const DEBOUNCE_MS = 400;

const CourseSearch: React.FC<CourseSearchProps> = ({ onSearch, initialSearch = '' }) => {
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="mt-12 w-full max-w-[560px]">
      <div className="relative h-[43px]">
        <span className="absolute inset-y-0 left-3 flex items-center text-white/60 pointer-events-none">
          <Icon name='icon-search' size={24} className="text-white/60" />
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search courses, topics, or levels..."
          className="h-full w-full rounded-[12px] border border-white/60 bg-black/15 pl-10 pr-3 text-[16px] leading-[1.5] text-[var(--color-white)] placeholder:text-white/60 shadow-2xl focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
        />
      </div>
    </div>
  );
};

export default CourseSearch;