import {
  calculateReadingTime,
  cleanAuthorName,
  getHostname,
} from "./article.js";

export function exportSummaryAsMarkdown({ article, summary, summaryType }) {
  const articleReadingTime =
    article.readingTime || calculateReadingTime(article.text || "");

  const summaryReadingTime = calculateReadingTime(summary);

  const markdown = buildMarkdownContent({
    article,
    summary,
    summaryType,
    articleReadingTime,
    summaryReadingTime,
  });

  downloadMarkdownFile(markdown, article.title);
}

function buildMarkdownContent({
  article,
  summary,
  summaryType,
  articleReadingTime,
  summaryReadingTime,
}) {
  const authorLine = article.author
    ? `**Author:** ${cleanAuthorName(article.author)}`
    : "";

  const source = article.siteName || getHostname(article.url);

  return `# ${article.title || "Article Summary"}
  
  ${authorLine}
  **Source:** ${source}
  **Original article:** ${article.url}
  **Summary style:** ${formatSummaryType(summaryType)}
  **Original reading time:** ${articleReadingTime} min
  **Summary reading time:** ${summaryReadingTime} min
  **Exported:** ${new Date().toLocaleString()}
  
  ---
  
  ## Summary
  
  ${summary}
  
  ---
  
  _Generated using AI Article Summarizer._
  `.trim();
}

function downloadMarkdownFile(markdown, title) {
  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${sanitizeFileName(title)}-summary.md`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function sanitizeFileName(fileName = "article") {
  return (
    fileName
      .toLowerCase()
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "article"
  );
}

export function formatSummaryType(summaryType) {
  const labels = {
    brief: "Brief Summary",
    detailed: "Detailed Summary",
    bullets: "Key Bullet Points",
  };

  return labels[summaryType] || "Summary";
}
