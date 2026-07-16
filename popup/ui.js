import {
  calculateReadingTime,
  cleanAuthorName,
  getHostname,
} from "./article.js";

import { formatRelativeTime } from "./history.js";

import { formatSummaryType } from "./markdown.js";

export const elements = {
  summarizeButton: document.getElementById("summarize"),
  copyButton: document.getElementById("copy-btn"),
  markdownButton: document.getElementById("markdown-btn"),
  settingsButton: document.getElementById("settings-btn"),

  result: document.getElementById("result"),
  summaryType: document.getElementById("summary-type"),

  articleInfo: document.getElementById("article-info"),
  articleTitle: document.getElementById("article-title"),
  articleAuthor: document.getElementById("article-author"),
  articleSite: document.getElementById("article-site"),
  articleReadingTime: document.getElementById("article-reading-time"),

  summaryStatus: document.getElementById("summary-status"),

  historySection: document.getElementById("history-section"),

  historyList: document.getElementById("history-list"),

  clearHistoryButton: document.getElementById("clear-history-btn"),
};

export function displaySummary(summary, statusText) {
  elements.result.textContent = summary;

  elements.copyButton.disabled = false;
  elements.markdownButton.disabled = false;

  elements.summaryStatus.textContent = statusText;
  elements.summaryStatus.classList.remove("hidden");
}

export function displayArticleMetadata(article) {
  elements.articleInfo.classList.remove("hidden");

  elements.articleTitle.textContent = article.title || "Untitled article";

  elements.articleSite.textContent =
    article.siteName || getHostname(article.url);

  elements.articleReadingTime.textContent = `${article.readingTime || calculateReadingTime(article.text)} min read`;

  if (article.author?.trim()) {
    elements.articleAuthor.textContent = cleanAuthorName(article.author);

    elements.articleAuthor.classList.remove("hidden");
  } else {
    elements.articleAuthor.classList.add("hidden");
  }
}

export function setLoadingState(message) {
  elements.copyButton.disabled = true;
  elements.markdownButton.disabled = true;

  elements.summaryStatus.classList.add("hidden");

  setControlsDisabled(true);

  elements.result.innerHTML = `
      <div class="loading">
        <div class="loader"></div>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
}

export function setControlsDisabled(disabled) {
  elements.summarizeButton.disabled = disabled;
  elements.summaryType.disabled = disabled;
}

export function showError(message) {
  elements.copyButton.disabled = true;
  elements.markdownButton.disabled = true;

  elements.summaryStatus.classList.add("hidden");

  elements.result.innerHTML = `
      <div class="error-message">
        ${escapeHtml(message)}
      </div>
    `;
}

export function renderSummaryHistory(history, onSelect) {
  elements.historyList.innerHTML = "";

  if (!history?.length) {
    elements.historySection.classList.add("hidden");
    return;
  }

  elements.historySection.classList.remove("hidden");

  history.slice(0, 5).forEach((item) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "history-item";

    const title = document.createElement("span");

    title.className = "history-item-title";
    title.textContent = item.title || "Untitled article";

    const meta = document.createElement("span");

    meta.className = "history-item-meta";

    const summaryType = document.createElement("span");

    summaryType.textContent = formatSummaryType(item.summaryType);

    const separator = document.createElement("span");

    separator.textContent = "•";

    const time = document.createElement("span");

    time.textContent = formatRelativeTime(item.createdAt);

    meta.append(summaryType, separator, time);
    button.append(title, meta);

    button.addEventListener("click", () => {
      onSelect(item);
    });

    elements.historyList.appendChild(button);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
