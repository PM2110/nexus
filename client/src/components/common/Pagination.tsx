import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
}) => {
  const { t } = useTranslation();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-4 w-full text-sm text-neutral-400">
      {totalItems !== undefined && (
        <div>
          {t('common.pagination_showing', {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3.5 py-1.5 rounded-lg border border-[#222b38] bg-[#131a24] hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-300 transition-colors"
        >
          {t('common.pagination_prev')}
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              page === currentPage
                ? 'bg-[#1ec8b5] text-[#0a0e14] font-semibold'
                : page === '...'
                ? 'cursor-default text-neutral-500'
                : 'border border-[#222b38] bg-[#131a24] text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3.5 py-1.5 rounded-lg border border-[#222b38] bg-[#131a24] hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-300 transition-colors"
        >
          {t('common.pagination_next')}
        </button>
      </div>
    </div>
  );
};
