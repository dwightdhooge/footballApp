// Request deduplication to prevent multiple simultaneous requests for the same data
class RequestDeduplicator {
  private requestCache = new Map<string, Promise<any>>();

  async execute<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // If a request is already in progress, return the existing promise
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key)!;
    }

    // Create new request promise
    const promise = fetcher();
    this.requestCache.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up the cache entry after request completes (success or failure)
      this.requestCache.delete(key);
    }
  }

  // Check if a request is currently in progress
  isRequestInProgress(key: string): boolean {
    return this.requestCache.has(key);
  }

  // Get the number of active requests
  getActiveRequestCount(): number {
    return this.requestCache.size;
  }

  // Clear all active requests (useful for cleanup)
  clear(): void {
    this.requestCache.clear();
  }
}

// Export singleton instance
export const requestDeduplicator = new RequestDeduplicator();

// Convenience function for common use case
export const fetchWithDeduplication = <T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> => {
  return requestDeduplicator.execute(key, fetcher);
};
