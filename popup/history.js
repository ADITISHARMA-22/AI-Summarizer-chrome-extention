const MAX_HISTORY_ITEMS = 20;

export async function getSummaryHistory() {
  const { summaryHistory = [] } =
    await chrome.storage.local.get("summaryHistory");

  return summaryHistory;
}

export async function saveSummaryToHistory(cacheEntry) {
  const history = await getSummaryHistory();

  const filteredHistory = history.filter(
    (item) => item.cacheKey !== cacheEntry.cacheKey,
  );

  filteredHistory.unshift(cacheEntry);

  await chrome.storage.local.set({
    summaryHistory: filteredHistory.slice(0, MAX_HISTORY_ITEMS),
  });
}

export async function clearSummaryHistory() {
  await chrome.storage.local.remove("summaryHistory");
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "Previously";
  }

  const difference = Date.now() - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    return `${Math.floor(difference / minute)} min ago`;
  }

  if (difference < day) {
    return `${Math.floor(difference / hour)} hr ago`;
  }

  if (difference < 7 * day) {
    const days = Math.floor(difference / day);

    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(timestamp).toLocaleDateString();
}
