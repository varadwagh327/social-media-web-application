'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

/**
 * Custom hook for infinite scroll functionality
 * Observes intersection with sentinel element and triggers callback when near bottom
 */
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return sentinelRef;
};

/**
 * Custom hook for handling pagination
 */
export const usePagination = (defaultPage: number = 1, defaultLimit: number = 20) => {
  const [page, setPage] = useCallback([defaultPage, () => {}] as const, []);
  const [limit, setLimit] = useCallback([defaultLimit, () => {}] as const, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  const goToNextPage = useCallback(() => {
    setPage((prev: number) => prev + 1);
  }, [setPage]);

  const goToPreviousPage = useCallback(() => {
    setPage((prev: number) => Math.max(1, prev - 1));
  }, [setPage]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
};
