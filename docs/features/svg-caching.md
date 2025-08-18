# SVG Caching System

## Overview

Het SVG caching systeem is geïmplementeerd om de performance van de app te verbeteren door SVG afbeeldingen (vlaggen, logo's, etc.) lokaal op te slaan en te hergebruiken. Dit voorkomt dat dezelfde afbeeldingen elke keer opnieuw worden opgehaald van het internet.

## Features

### 🚀 **Automatische Caching**

- SVG's worden automatisch gecached bij eerste gebruik
- Standaard TTL (Time-To-Live) van 24 uur
- Intelligente cache size management (max 1000 items)

### 💾 **Storage Management**

- Gebruikt AsyncStorage voor persistente opslag
- Automatische cleanup van verlopen items
- Configurable cache limits

### 🎯 **Smart Loading**

- Laadt eerst uit cache (instant)
- Fallback naar netwerk bij cache miss
- Loading states en error handling

### ⚙️ **Configurable**

- Custom TTL per SVG mogelijk
- Cache statistics en management
- User-controlled cache clearing

## Architecture

### Core Components

#### 1. **SvgCacheService** (`src/services/storage/svgCache.ts`)

```typescript
class SvgCacheService {
  async get(url: string): Promise<string | null>;
  async set(url: string, data: string, ttl?: number): Promise<void>;
  async has(url: string): Promise<boolean>;
  async clear(): Promise<void>;
  async getStats(): Promise<CacheStats>;
  async cleanup(): Promise<void>;
}
```

#### 2. **useSvgCache Hook** (`src/hooks/useSvgCache.ts`)

```typescript
const { svgData, isLoading, error, refetch } = useSvgCache(url, { ttl });
```

#### 3. **SvgImage Component** (`src/components/common/SvgImage.tsx`)

```typescript
<SvgImage
  url={svgUrl}
  size={24}
  ttl={customTtl}
  fallbackText="Flag"
  borderRadius={4}
/>
```

## Usage Examples

### Basic Flag Usage

```typescript
import { FlagSvg } from "@/components";

<FlagSvg url={country.flag} size={24} />;
```

### Custom TTL for Logos

```typescript
import { SvgImage } from "@/components";

<SvgImage
  url={team.logo}
  size={32}
  ttl={7 * 24 * 60 * 60 * 1000} // 7 days
  fallbackText="Team"
  borderRadius={16}
/>;
```

### Cache Management

```typescript
import { useSvgCacheManagement } from "@/hooks";

const { clearCache, getCacheStats, cleanupCache } = useSvgCacheManagement();

// Get cache statistics
const stats = await getCacheStats();
console.log(`Cached ${stats.size} images`);

// Clean up expired items
await cleanupCache();

// Clear all cache
await clearCache();
```

## Configuration

### Default Settings

```typescript
const defaultConfig = {
  defaultTtl: 24 * 60 * 60 * 1000, // 24 hours
  maxCacheSize: 1000, // maximum cached items
};
```

### Custom Configuration

```typescript
import { SvgCacheService } from "@/services/storage/svgCache";

const customCache = new SvgCacheService({
  defaultTtl: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxCacheSize: 2000, // more cache space
});
```

## Performance Benefits

### Before (No Caching)

- Elke SVG wordt opgehaald bij elke render
- Netwerk latency bij elke request
- Hoger dataverbruik
- Langzamere UI updates

### After (With Caching)

- Instant loading van gecachte SVG's
- Minder netwerk requests
- Lager dataverbruik
- Vloeiendere UI ervaring

## Cache Lifecycle

1. **First Load**: SVG wordt opgehaald van netwerk en opgeslagen in cache
2. **Subsequent Loads**: SVG wordt geladen uit cache (instant)
3. **TTL Expiry**: Cache item wordt automatisch verwijderd
4. **Cache Full**: Oudste items worden automatisch verwijderd (bij 1000 items)
5. **Manual Cleanup**: User kan cache handmatig legen

## Error Handling

### Network Errors

- Fallback naar error state
- Retry mechanism via refetch
- User feedback via error messages

### Cache Errors

- Graceful degradation naar netwerk loading
- Automatic cache cleanup bij corruptie
- Logging voor debugging

## Monitoring & Debugging

### Cache Statistics

```typescript
const stats = await svgCache.getStats();
console.log({
  size: stats.size,
  oldest: new Date(stats.oldest),
  newest: new Date(stats.newest),
});
```

### Debug Logging

```typescript
// Enable debug logging
console.log("SVG Cache:", {
  url,
  cached: await svgCache.has(url),
  data: await svgCache.get(url),
});
```

## Best Practices

### 1. **TTL Selection**

- **Flags**: 24-48 hours (rarely change)
- **Team Logos**: 7-30 days (seasonal changes)
- **League Logos**: 30-90 days (rarely change)

### 2. **Cache Management**

- Regular cleanup van verlopen items
- Monitor cache size en performance
- User optie om cache te legen

### 3. **Error Handling**

- Always provide fallback states
- Graceful degradation bij cache failures
- User feedback voor loading states

## Future Enhancements

### Planned Features

- [ ] **Compression**: SVG compression voor kleinere storage
- [ ] **Preloading**: Intelligente preloading van veelgebruikte SVG's
- [ ] **CDN Integration**: Fallback naar CDN bij cache miss
- [ ] **Analytics**: Cache hit/miss ratio tracking

### Potential Optimizations

- [ ] **Lazy Loading**: Load SVG's alleen wanneer zichtbaar
- [ ] **Priority Queue**: Prioriteit voor belangrijke SVG's
- [ ] **Background Sync**: Cache updates in background
- [ ] **Offline Support**: Full offline SVG access

## Troubleshooting

### Common Issues

#### Cache Not Working

```typescript
// Check if cache is properly initialized
const stats = await svgCache.getStats();
console.log("Cache stats:", stats);

// Verify AsyncStorage permissions
import AsyncStorage from "@react-native-async-storage/async-storage";
const test = await AsyncStorage.setItem("test", "value");
```

#### Memory Issues

```typescript
// Reduce cache size
const smallCache = new SvgCacheService({ maxCacheSize: 500 });

// Clear cache manually
await svgCache.clear();
```

#### Performance Issues

```typescript
// Check cache hit ratio
const start = Date.now();
const cached = await svgCache.has(url);
const end = Date.now();
console.log(`Cache check took ${end - start}ms`);
```

## Migration Guide

### From Old Implementation

```typescript
// OLD: Direct SvgUri usage
<SvgUri uri={flagUrl} width={24} height={24} />

// NEW: Cached FlagSvg
<FlagSvg url={flagUrl} size={24} />
```

### From Custom Caching

```typescript
// OLD: Manual cache implementation
const [cachedFlag, setCachedFlag] = useState(null);
useEffect(() => {
  // Custom caching logic
}, [flagUrl]);

// NEW: Hook-based caching
const { svgData, isLoading } = useSvgCache(flagUrl);
```
