export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

function normalizeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hash = "";

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

function createSimpleHash(value) {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}

export function createCacheKey(url, summaryType) {
  const value = `${normalizeUrl(url)}:${summaryType}`;

  return `summary-cache-${createSimpleHash(value)}`;
}

export async function getCachedSummary(cacheKey) {
  const storedData = await chrome.storage.local.get(cacheKey);
  const cachedEntry = storedData[cacheKey];

  if (!cachedEntry) {
    return null;
  }

  const age = Date.now() - cachedEntry.createdAt;

  if (age >= CACHE_DURATION_MS) {
    await chrome.storage.local.remove(cacheKey);
    return null;
  }

  return cachedEntry;
}

export async function saveSummaryToCache(cacheKey, cacheEntry) {
  await chrome.storage.local.set({
    [cacheKey]: cacheEntry,
  });
}

export async function clearSummaryCache() {
  const storedData = await chrome.storage.local.get(null);

  const cacheKeys = Object.keys(storedData).filter((key) =>
    key.startsWith("summary-cache-"),
  );

  if (cacheKeys.length) {
    await chrome.storage.local.remove(cacheKeys);
  }
}
