import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
  threshold?: number; // IntersectionObserver threshold
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  hasMore,
  isLoading,
  children,
  loader,
  endMessage,
  className = '',
  threshold = 0.1,
}) => {
  const detectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentDetector = detectorRef.current;
    if (!currentDetector || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: '100px', // trigger a bit before the user scrolls all the way down
        threshold,
      }
    );

    observer.observe(currentDetector);

    return () => {
      if (currentDetector) {
        observer.unobserve(currentDetector);
      }
    };
  }, [loadMore, hasMore, isLoading, threshold]);

  const defaultLoader = (
    <div className="flex justify-center items-center py-4 gap-2">
      <svg className="animate-spin h-5 w-5 text-[#1ec8b5]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-xs text-[#5e6a7a] font-mono">Loading more...</span>
    </div>
  );

  return (
    <div className={`infinite-scroll-container ${className}`}>
      {children}

      {/* Detector at the bottom */}
      {hasMore && (
        <div ref={detectorRef} className="h-4 w-full opacity-0 pointer-events-none" />
      )}

      {/* Loading indicator */}
      {isLoading && (loader || defaultLoader)}

      {/* End message */}
      {!hasMore && endMessage}
    </div>
  );
};
