import { LocaleType } from "../types";

interface LocaleCacheEntry {
  branch: string;
  locales: LocaleType[];
  timestamp: number;
  expiresAt: number;
}

const CACHE_CONFIG = {
  TTL: 15 * 60 * 1000, // 15 minutes in milliseconds
  KEY_PREFIX: "cs_locales_cache_",
};

// Get cache key for a branch
const getCacheKey = (branch: string): string =>
  `${CACHE_CONFIG?.KEY_PREFIX}${branch}`;

// Get cached locales for a branch
export const getCachedLocales = (branch: string): LocaleType[] | null => {
  try {
    const cacheKey = getCacheKey(branch);
    const cachedData = localStorage?.getItem(cacheKey);

    if (!cachedData) {
      return null;
    }

    const entry: LocaleCacheEntry = JSON.parse(cachedData);
    const now = Date.now();

    // Check if cache is expired
    if (now > entry.expiresAt) {
      // Remove expired cache
      localStorage?.removeItem(cacheKey);
      return null;
    }

    return entry.locales;
  } catch (error) {
    console.error(`Error reading cache for branch "${branch}":`, error);
    // If cache causing errors, remove it
    try {
      localStorage?.removeItem(getCacheKey(branch));
    } catch (e) {
      console.error(`Error removing cache for branch "${branch}":`, e);
    }
    return null;
  }
};

// Set cached locales for a branch
export const setCachedLocales = (
  branch: string,
  locales: LocaleType[]
): void => {
  try {
    const cacheKey = getCacheKey(branch);
    const now = Date.now();

    const entry: LocaleCacheEntry = {
      branch,
      locales,
      timestamp: now,
      expiresAt: now + CACHE_CONFIG.TTL,
    };

    localStorage?.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.error(`Error setting cache for branch "${branch}":`, error);
    // If localStorage quota exceeded, silently fail
    // The app will still work, just without caching
  }
};

// Clear cached locales for a specific branch or all branches
export const clearCachedLocales = (branch?: string): void => {
  try {
    if (branch) {
      // Clear specific branch
      localStorage?.removeItem(getCacheKey(branch));
    } else {
      // Clear all locale caches
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key?.startsWith(CACHE_CONFIG.KEY_PREFIX)) {
          localStorage?.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

// Check if cache entry is valid
export const isCacheValid = (entry: LocaleCacheEntry | null): boolean => {
  if (!entry) return false;
  return Date.now() < entry?.expiresAt;
};
