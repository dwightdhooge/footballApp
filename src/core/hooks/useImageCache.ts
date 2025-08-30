import { useState, useEffect, useCallback } from "react";
import { imageCache } from "@/services/storage/imageCache";

interface UseImageCacheResult {
  imageData: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseImageCacheOptions {
  ttl?: number; // custom TTL in milliseconds
  skip?: boolean; // skip fetching if true
  convertToBase64?: boolean; // whether to convert images to base64 for caching
}

/**
 * Hook for caching and retrieving images (SVG, PNG, JPG, etc.) with automatic caching
 */
export const useImageCache = (
  url: string | null,
  options: UseImageCacheOptions = {}
): UseImageCacheResult => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { ttl, skip = false, convertToBase64 = true } = options;

  const fetchImage = useCallback(
    async (imageUrl: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // First check cache
        const cached = await imageCache.get(imageUrl);
        if (cached) {
          setImageData(cached);
          return;
        }

        // If not in cache, fetch from network
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type") || "";
        let imageContent: string;

        if (contentType.includes("svg")) {
          // For SVG, get as text
          imageContent = await response.text();
        } else if (convertToBase64) {
          // For other images, convert to base64
          const blob = await response.blob();
          imageContent = await blobToBase64(blob);
        } else {
          // If not converting to base64, just use the URL
          imageContent = imageUrl;
        }

        // Store in cache (only if we have actual content)
        if (imageContent && imageContent !== imageUrl) {
          await imageCache.set(imageUrl, imageContent, contentType, ttl);
        }

        setImageData(imageContent);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(error);
        console.warn("Error fetching image:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [ttl, convertToBase64]
  );

  const refetch = useCallback(async () => {
    if (url && !skip) {
      await fetchImage(url);
    }
  }, [url, skip, fetchImage]);

  useEffect(() => {
    if (url && !skip) {
      fetchImage(url);
    }
  }, [url, skip, fetchImage]);

  return {
    imageData,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for checking if an image is cached
 */
export const useImageCacheStatus = (
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
        const cached = await imageCache.has(url);
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
 * Hook for managing image cache (clear, stats, cleanup)
 */
export const useImageCacheManagement = () => {
  const clearCache = useCallback(async () => {
    try {
      await imageCache.clear();
      console.log("Image cache cleared");
    } catch (error) {
      console.warn("Error clearing image cache:", error);
    }
  }, []);

  const getCacheStats = useCallback(async () => {
    try {
      return await imageCache.getStats();
    } catch (error) {
      console.warn("Error getting cache stats:", error);
      return {
        size: 0,
        oldest: null,
        newest: null,
        totalSize: 0,
        typeBreakdown: {},
      };
    }
  }, []);

  const cleanupCache = useCallback(async () => {
    try {
      await imageCache.cleanup();
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

/**
 * Utility function to convert blob to base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
