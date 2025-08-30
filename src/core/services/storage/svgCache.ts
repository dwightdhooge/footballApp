import AsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_TTL } from "@/core/utils/constants/cache";

interface CachedSvg {
  data: string;
  timestamp: number;
  ttl: number; // time-to-live in milliseconds
}

interface SvgCacheConfig {
  defaultTtl?: number; // default TTL in milliseconds (24 hours)
  maxCacheSize?: number; // maximum number of cached items
}

class SvgCacheService {
  private readonly STORAGE_KEY = "svg_cache";
  private readonly defaultTtl: number;
  private readonly maxCacheSize: number;

  constructor(config: SvgCacheConfig = {}) {
    this.defaultTtl = config.defaultTtl || CACHE_TTL.svgCache; // 24 hours default
    this.maxCacheSize = config.maxCacheSize || 1000; // max 1000 cached items
  }

  /**
   * Get SVG from cache if it exists and is not expired
   */
  async get(url: string): Promise<string | null> {
    try {
      const cache = await this.getCache();
      const cached = cache[url];

      if (!cached) {
        console.log(`[SvgCache] Cache MISS for: ${url}`);
        return null;
      }

      // Check if expired
      if (Date.now() - cached.timestamp > cached.ttl) {
        console.log(`[SvgCache] Cache EXPIRED for: ${url}`);
        // Remove expired item
        delete cache[url];
        await this.saveCache(cache);
        return null;
      }

      console.log(`[SvgCache] Cache HIT for: ${url}`);
      return cached.data;
    } catch (error) {
      console.warn("Error reading from SVG cache:", error);
      return null;
    }
  }

  /**
   * Store SVG in cache with TTL
   */
  async set(url: string, data: string, ttl?: number): Promise<void> {
    try {
      const cache = await this.getCache();

      // Add new item
      cache[url] = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTtl,
      };

      console.log(`[SvgCache] Cached SVG: ${url} (${data.length} chars)`);

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

        console.log(
          `[SvgCache] Cache full (${urls.length}/${this.maxCacheSize}), removing ${itemsToRemove.length} oldest items`
        );

        itemsToRemove.forEach((url) => delete cache[url]);
      }

      await this.saveCache(cache);
    } catch (error) {
      console.warn("Error writing to SVG cache:", error);
    }
  }

  /**
   * Check if SVG exists in cache and is not expired
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
      console.warn("Error checking SVG cache:", error);
      return false;
    }
  }

  /**
   * Clear all cached SVGs
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn("Error clearing SVG cache:", error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    size: number;
    oldest: number | null;
    newest: number | null;
  }> {
    try {
      const cache = await this.getCache();
      const urls = Object.keys(cache);

      if (urls.length === 0) {
        return { size: 0, oldest: null, newest: null };
      }

      const timestamps = urls.map((url) => cache[url].timestamp);
      return {
        size: urls.length,
        oldest: Math.min(...timestamps),
        newest: Math.max(...timestamps),
      };
    } catch (error) {
      console.warn("Error getting cache stats:", error);
      return { size: 0, oldest: null, newest: null };
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
        console.log(`Cleaned up ${cleanedCount} expired SVG cache items`);
      }
    } catch (error) {
      console.warn("Error cleaning up SVG cache:", error);
    }
  }

  private async getCache(): Promise<Record<string, CachedSvg>> {
    try {
      const cached = await AsyncStorage.getItem(this.STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn("Error reading SVG cache:", error);
      return {};
    }
  }

  private async saveCache(cache: Record<string, CachedSvg>): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn("Error saving SVG cache:", error);
    }
  }
}

// Export singleton instance
export const svgCache = new SvgCacheService();

// Export class for testing or custom instances
export { SvgCacheService };
export type { CachedSvg, SvgCacheConfig };
