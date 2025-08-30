import AsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_TTL } from "@/core/utils/constants/cache";

interface CachedImage {
  data: string; // base64 encoded data voor PNG/JPG, raw SVG content voor SVG
  timestamp: number;
  ttl: number; // time-to-live in milliseconds
  type: "svg" | "png" | "jpg" | "jpeg" | "webp"; // image type
  size: number; // file size in bytes
}

interface ImageCacheConfig {
  defaultTtl?: number; // default TTL in milliseconds (24 hours)
  maxCacheSize?: number; // maximum number of cached items
  maxFileSize?: number; // maximum file size to cache (5MB default)
}

class ImageCacheService {
  private readonly STORAGE_KEY = "image_cache";
  private readonly defaultTtl: number;
  private readonly maxCacheSize: number;
  private readonly maxFileSize: number;

  constructor(config: ImageCacheConfig = {}) {
    this.defaultTtl = config.defaultTtl || CACHE_TTL.imageCache; // 24 hours default
    this.maxCacheSize = config.maxCacheSize || 1000; // max 1000 cached items
    this.maxFileSize = config.maxFileSize || 5 * 1024 * 1024; // 5MB default
  }

  /**
   * Get image from cache if it exists and is not expired
   */
  async get(url: string): Promise<string | null> {
    try {
      const cache = await this.getCache();
      const cached = cache[url];

      if (!cached) {
        return null;
      }

      // Check if expired
      if (Date.now() - cached.timestamp > cached.ttl) {
        // Remove expired item
        delete cache[url];
        await this.saveCache(cache);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.warn(`[ImageCache] Error reading from cache for ${url}:`, error);
      return null;
    }
  }

  /**
   * Store image in cache with TTL
   */
  async set(
    url: string,
    data: string,
    type: string,
    ttl?: number
  ): Promise<void> {
    try {
      // Determine image type
      const imageType = this.getImageType(url, type);

      // Check file size (approximate for base64)
      const estimatedSize = this.estimateFileSize(data, imageType);

      if (estimatedSize > this.maxFileSize) {
        console.warn(
          `[ImageCache] Image too large to cache: ${estimatedSize} bytes`
        );
        return;
      }

      const cache = await this.getCache();

      // Add new item
      cache[url] = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTtl,
        type: imageType,
        size: estimatedSize,
      };

      // Enforce max cache size
      const urls = Object.keys(cache);
      if (urls.length > this.maxCacheSize) {
        // Remove oldest items
        const sortedUrls = urls.sort(
          (a, b) => cache[a].timestamp - cache[b].timestamp
        );

        const itemsToRemove = sortedUrls.slice(
          0,
          urls.length - this.maxCacheSize
        );

        itemsToRemove.forEach((url) => delete cache[url]);
      }

      await this.saveCache(cache);
    } catch (error) {
      console.warn(`[ImageCache] Error writing to cache for ${url}:`, error);
    }
  }

  /**
   * Check if image exists in cache and is not expired
   */
  async has(url: string): Promise<boolean> {
    try {
      const cache = await this.getCache();
      const cached = cache[url];

      if (!cached) {
        return false;
      }

      // Check if expired
      if (Date.now() - cached.timestamp > cached.ttl) {
        // Remove expired item
        delete cache[url];
        await this.saveCache(cache);
        return false;
      }

      return true;
    } catch (error) {
      console.warn(`[ImageCache] Error checking cache for ${url}:`, error);
      return false;
    }
  }

  /**
   * Get image type from URL or MIME type
   */
  private getImageType(
    url: string,
    mimeType?: string
  ): "svg" | "png" | "jpg" | "jpeg" | "webp" {
    if (mimeType) {
      if (mimeType.includes("svg")) return "svg";
      if (mimeType.includes("png")) return "png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
      if (mimeType.includes("webp")) return "webp";
    }

    // Fallback to URL extension
    const extension = url.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "svg":
        return "svg";
      case "png":
        return "png";
      case "jpg":
      case "jpeg":
        return "jpg";
      case "webp":
        return "webp";
      default:
        return "png"; // default fallback
    }
  }

  /**
   * Estimate file size based on image type and data
   */
  private estimateFileSize(data: string, type: string): number {
    if (type === "svg") {
      // SVG is text, so use string length
      return data.length;
    } else {
      // For base64 encoded images, estimate size
      // Base64 encoding increases size by ~33%
      return Math.ceil(data.length * 0.75);
    }
  }

  /**
   * Clear all cached images
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn("Error clearing image cache:", error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    size: number;
    oldest: number | null;
    newest: number | null;
    totalSize: number;
    typeBreakdown: Record<string, number>;
  }> {
    try {
      const cache = await this.getCache();
      const urls = Object.keys(cache);

      if (urls.length === 0) {
        return {
          size: 0,
          oldest: null,
          newest: null,
          totalSize: 0,
          typeBreakdown: {},
        };
      }

      const timestamps = urls.map((url) => cache[url].timestamp);
      const totalSize = urls.reduce((sum, url) => sum + cache[url].size, 0);

      // Count by type
      const typeBreakdown = urls.reduce((acc, url) => {
        const type = cache[url].type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        size: urls.length,
        oldest: Math.min(...timestamps),
        newest: Math.max(...timestamps),
        totalSize,
        typeBreakdown,
      };
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
  }

  /**
   * Clean up expired items
   */
  async cleanup(): Promise<void> {
    try {
      const cache = await this.getCache();
      const urls = Object.keys(cache);
      let cleanedCount = 0;

      urls.forEach((url) => {
        if (Date.now() - cache[url].timestamp > cache[url].ttl) {
          delete cache[url];
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        await this.saveCache(cache);
        console.log(`Cleaned up ${cleanedCount} expired image cache items`);
      }
    } catch (error) {
      console.warn("Error cleaning up image cache:", error);
    }
  }

  private async getCache(): Promise<Record<string, CachedImage>> {
    try {
      const cached = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!cached) {
        return {};
      }

      const parsed = JSON.parse(cached);
      return parsed;
    } catch (error) {
      console.warn(`[ImageCache] Error reading cache from storage:`, error);
      return {};
    }
  }

  private async saveCache(cache: Record<string, CachedImage>): Promise<void> {
    try {
      const cacheString = JSON.stringify(cache);
      await AsyncStorage.setItem(this.STORAGE_KEY, cacheString);
    } catch (error) {
      console.warn(`[ImageCache] Error saving cache to storage:`, error);
    }
  }
}

// Export singleton instance
export const imageCache = new ImageCacheService();

// Export class for testing or custom instances
export { ImageCacheService };
export type { CachedImage, ImageCacheConfig };
