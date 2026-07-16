export function isUnsupportedPage(url = "") {
  const unsupportedPrefixes = [
    "chrome://",
    "chrome-extension://",
    "edge://",
    "about:",
    "view-source:",
  ];

  return unsupportedPrefixes.some((prefix) => url.startsWith(prefix));
}

export function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(
          new Error(
            "The extension could not communicate with this page. Refresh it and try again.",
          ),
        );
        return;
      }

      resolve(response);
    });
  });
}

export function calculateReadingTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export function cleanAuthorName(author = "") {
  return author.replace(/^by\s+/i, "").trim();
}

export function getHostname(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Web article";
  }
}
