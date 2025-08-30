import { CACHE_TTL } from "@/core/utils/constants/cache";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheStorage {
  private cache = new Map<string, CacheEntry<any>>();

  // Store data with automatic TTL or custom TTL
  set<T>(key: string, data: T, customTtl?: number): void {
    const ttl = customTtl || CACHE_TTL.default;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);
    console.log(`[Cache] Stored: ${key} (TTL: ${ttl}ms)`);
  }

  // Retrieve data if not expired
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`[Cache] MISS: ${key}`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      console.log(
        `[Cache] EXPIRED: ${key} (age: ${
          Date.now() - entry.timestamp
        }ms, TTL: ${entry.ttl}ms)`
      );
      this.cache.delete(key);
      return null;
    }

    console.log(
      `[Cache] HIT: ${key} (age: ${Date.now() - entry.timestamp}ms, TTL: ${
        entry.ttl
      }ms)`
    );
    return entry.data;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[Cache] Cleaned up ${cleanedCount} expired entries`);
    }
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    console.log("[Cache] Cleared all entries");
  }
}

// Export singleton instance
export const cacheStorage = new CacheStorage();

// Auto-cleanup every 5 minutes
setInterval(() => {
  cacheStorage.cleanup();
}, CACHE_TTL.cleanupInterval);
