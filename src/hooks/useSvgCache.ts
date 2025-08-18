import { useState, useEffect, useCallback } from "react";
import { svgCache } from "@/services/storage/svgCache";

interface UseSvgCacheResult {
  svgData: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseSvgCacheOptions {
  ttl?: number; // custom TTL in milliseconds
  skip?: boolean; // skip fetching if true
}

/**
 * Hook for caching and retrieving SVG data with automatic caching
 */
export const useSvgCache = (
  url: string | null,
  options: UseSvgCacheOptions = {}
): UseSvgCacheResult => {
  const [svgData, setSvgData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { ttl, skip = false } = options;

  const fetchSvg = useCallback(
    async (svgUrl: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // First check cache
        const cached = await svgCache.get(svgUrl);
        if (cached) {
          setSvgData(cached);
          return;
        }

        // If not in cache, fetch from network
        const response = await fetch(svgUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch SVG: ${response.status} ${response.statusText}`
          );
        }

        const svgText = await response.text();

        // Store in cache
        await svgCache.set(svgUrl, svgText, ttl);

        setSvgData(svgText);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(error);
        console.warn("Error fetching SVG:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [ttl]
  );

  const refetch = useCallback(async () => {
    if (url && !skip) {
      await fetchSvg(url);
    }
  }, [url, skip, fetchSvg]);

  useEffect(() => {
    if (url && !skip) {
      fetchSvg(url);
    }
  }, [url, skip, fetchSvg]);

  return {
    svgData,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for checking if an SVG is cached
 */
export const useSvgCacheStatus = (
  url: string | null
): { isCached: boolean; isLoading: boolean } => {
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setIsCached(false);
      return;
    }

    const checkCache = async () => {
      setIsLoading(true);
      try {
        const cached = await svgCache.has(url);
        setIsCached(cached);
      } catch (error) {
        setIsCached(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkCache();
  }, [url]);

  return { isCached, isLoading };
};

/**
 * Hook for managing SVG cache (clear, stats, cleanup)
 */
export const useSvgCacheManagement = () => {
  const clearCache = useCallback(async () => {
    try {
      await svgCache.clear();
      console.log("SVG cache cleared");
    } catch (error) {
      console.warn("Error clearing SVG cache:", error);
    }
  }, []);

  const getCacheStats = useCallback(async () => {
    try {
      return await svgCache.getStats();
    } catch (error) {
      console.warn("Error getting cache stats:", error);
      return { size: 0, oldest: null, newest: null };
    }
  }, []);

  const cleanupCache = useCallback(async () => {
    try {
      await svgCache.cleanup();
    } catch (error) {
      console.warn("Error cleaning up cache:", error);
    }
  }, []);

  return {
    clearCache,
    getCacheStats,
    cleanupCache,
  };
};
