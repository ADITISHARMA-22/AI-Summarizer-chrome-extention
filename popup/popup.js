import { getGeminiSummary } from "./gemini.js";

import {
  calculateReadingTime,
  getHostname,
  isUnsupportedPage,
  sendMessageToTab,
} from "./article.js";

import {
  createCacheKey,
  getCachedSummary,
  saveSummaryToCache,
  clearSummaryCache,
} from "./storage.js";

import {
  clearSummaryHistory,
  getSummaryHistory,
  saveSummaryToHistory,
} from "./history.js";

import { exportSummaryAsMarkdown } from "./markdown.js";

import {
  elements,
  displayArticleMetadata,
  displaySummary,
  renderSummaryHistory,
  setControlsDisabled,
  setLoadingState,
  showError,
} from "./ui.js";

let currentSummary = "";
let currentArticle = null;
let isGenerating = false;

elements.summarizeButton.addEventListener("click", handleSummarize);

elements.copyButton.addEventListener("click", handleCopy);

elements.markdownButton.addEventListener("click", handleMarkdownExport);

elements.settingsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

elements.clearHistoryButton.addEventListener("click", handleClearHistory);

async function handleSummarize() {
  if (isGenerating) {
    return;
  }

  isGenerating = true;
  currentSummary = "";
  currentArticle = null;

  setLoadingState("Extracting article content...");

  try {
    const { geminiApiKey } = await chrome.storage.sync.get("geminiApiKey");

    if (!geminiApiKey) {
      showError("Gemini API key not found. Open settings and add it.");
      return;
    }

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id || isUnsupportedPage(tab.url)) {
      showError("This page cannot be summarized.");
      return;
    }

    const response = await sendMessageToTab(tab.id, {
      type: "GET_ARTICLE_TEXT",
    });

    if (!response?.success) {
      showError(response?.error || "Could not extract the article.");
      return;
    }

    currentArticle = response.article;

    displayArticleMetadata(currentArticle);

    const summaryType = elements.summaryType.value;

    const cacheKey = createCacheKey(currentArticle.url, summaryType);

    const cachedEntry = await getCachedSummary(cacheKey);

    if (cachedEntry) {
      currentSummary = cachedEntry.summary;

      displaySummary(currentSummary, "Cached");
      return;
    }

    setLoadingState("Generating summary with Gemini...");

    currentSummary = await getGeminiSummary(
      currentArticle,
      summaryType,
      geminiApiKey,
    );

    displaySummary(currentSummary, "Generated");

    const historyEntry = {
      cacheKey,
      url: currentArticle.url,
      title: currentArticle.title,
      author: currentArticle.author,
      siteName: currentArticle.siteName,
      summaryType,
      summary: currentSummary,
      articleReadingTime: calculateReadingTime(currentArticle.text),
      createdAt: Date.now(),
    };

    await saveSummaryToCache(cacheKey, historyEntry);
    await saveSummaryToHistory(historyEntry);

    await loadHistory();
  } catch (error) {
    console.error(error);

    showError(error.message || "Summary generation failed.");
  } finally {
    isGenerating = false;
    setControlsDisabled(false);
  }
}

async function handleCopy() {
  if (!currentSummary) {
    return;
  }

  await navigator.clipboard.writeText(currentSummary);
}

function handleMarkdownExport() {
  if (!currentSummary || !currentArticle) {
    return;
  }

  exportSummaryAsMarkdown({
    article: currentArticle,
    summary: currentSummary,
    summaryType: elements.summaryType.value,
  });
}

async function handleClearHistory() {
  await clearSummaryHistory();
  await clearSummaryCache();
  await loadHistory();
}

async function loadHistory() {
  const history = await getSummaryHistory();

  renderSummaryHistory(history, (item) => {
    currentSummary = item.summary;

    currentArticle = {
      title: item.title,
      author: item.author,
      siteName: item.siteName,
      url: item.url,
      text: "",
      readingTime: item.articleReadingTime,
    };

    elements.summaryType.value = item.summaryType;

    displayArticleMetadata(currentArticle);
    displaySummary(currentSummary, "History");
  });
}

loadHistory();
