// console.log("✅ Content script loaded");
// function getArticleText() {
//   const article = document.querySelector("article");
//   if (article) return article.innerText;

//   // fallback
//   const paragraphs = Array.from(document.querySelectorAll("p"));
//   return paragraphs.map((p) => p.innerText).join("\n");
// }

// chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
//   if (req.type === "GET_ARTICLE_TEXT") {
//     const text = getArticleText();
//     sendResponse({ text });
//   }
// });

function extractArticle() {
  if (typeof Readability === "undefined") {
    throw new Error("Mozilla Readability could not be loaded.");
  }

  /*
   * Readability modifies the DOM object that it parses.
   * We clone the page so the original Medium/article page is not changed.
   */
  const documentClone = document.cloneNode(true);

  const reader = new Readability(documentClone);
  const parsedArticle = reader.parse();

  if (!parsedArticle) {
    throw new Error("This page does not appear to contain a readable article.");
  }

  const text = parsedArticle.textContent?.trim();

  if (!text) {
    throw new Error(
      "The article was detected, but no readable text could be extracted.",
    );
  }

  if (text.length < 200) {
    throw new Error("The extracted page content is too short to summarize.");
  }

  return {
    title: parsedArticle.title || document.title || "Untitled article",
    author: parsedArticle.byline || "",
    siteName:
      parsedArticle.siteName || window.location.hostname.replace(/^www\./, ""),
    excerpt: parsedArticle.excerpt || "",
    text,
    length: parsedArticle.length || text.length,
    url: window.location.href,
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "GET_ARTICLE_TEXT") {
    return;
  }

  try {
    const article = extractArticle();

    sendResponse({
      success: true,

      // Keep this temporarily so your current popup.js still works.
      text: article.text,

      // Structured metadata for the redesigned popup.
      article,
    });
  } catch (error) {
    sendResponse({
      success: false,
      error:
        error instanceof Error ? error.message : "Article extraction failed.",
    });
  }
});
