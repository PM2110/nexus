import React, { useState, useEffect, useRef } from 'react';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  debounceMs = 300,
}) => {
  const [value, setValue] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, onSearch, debounceMs]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <span className="absolute left-3.5 flex items-center pointer-events-none text-[#5e6a7a]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0d131a] border border-[#222b38] hover:border-[#1ec8b5]/50 focus:border-[#1ec8b5] focus:ring-1 focus:ring-[#1ec8b5]/30 text-sm rounded-lg pl-10 pr-9 py-2.5 text-[#e1e6eb] placeholder-[#5e6a7a] transition-all outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-[#5e6a7a] hover:text-[#e1e6eb] transition-colors p-0.5 rounded-full hover:bg-[#1a232d] flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
