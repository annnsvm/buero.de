import React, { useState } from 'react';

interface CourseSearchProps {
  onSearch: (query: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); 
  };

  return (
    <div className="mt-12 w-full max-w-3xl"> 
    <div className="relative group">
      <span className="absolute inset-y-0 left-5 flex items-center text-white/40">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </span>
      
      <input
        type="text"
        placeholder="Search courses, topics, or levels..."
        className="w-full rounded-2xl border border-white/20  px-14 py-3 text-base text-white placeholder:text-white/40 shadow-2xl focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
      />
    </div>
  </div>
  );
};

export default CourseSearch;