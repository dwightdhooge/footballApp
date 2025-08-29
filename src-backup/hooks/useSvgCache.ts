import { useState, useEffect, useCallback } from "react";
import { svgCache } from "@/services/storage/svgCache";
import { fetchSvg } from "@/services/api";

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

  const fetchAndCacheSvg = useCallback(
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
        const result = await fetchSvg(svgUrl);
        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to fetch SVG");
        }

        const svgText = result.data;

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
      await fetchAndCacheSvg(url);
    }
  }, [url, skip, fetchAndCacheSvg]);

  useEffect(() => {
    if (url && !skip) {
      fetchAndCacheSvg(url);
    }
  }, [url, skip, fetchAndCacheSvg]);

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
