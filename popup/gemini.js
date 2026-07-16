const MODEL = "gemini-2.5-flash";

function truncateArticle(text, maxLength = 24000) {
  if (text.length <= maxLength) {
    return text;
  }

  const beginningLength = Math.floor(maxLength * 0.75);
  const endingLength = maxLength - beginningLength;

  return `${text.slice(0, beginningLength)}

[The middle section was omitted because the article was very long.]

${text.slice(-endingLength)}`;
}

function buildPrompt(article, summaryType) {
  const instructions = {
    brief: "Provide an accurate and concise summary in 2–3 sentences.",

    detailed:
      "Provide a structured and detailed summary covering the main argument, supporting points, important details and conclusion.",

    bullets:
      'Summarize the article in 5–7 concise points. Start every point with "- ".',
  };

  return `
You are summarizing an article for a reader.

Rules:
- Use only information contained in the article.
- Do not invent facts or conclusions.
- Preserve important names, numbers and claims.
- Make the output easy to understand.

Title: ${article.title || "Unknown"}
Author: ${article.author || "Unknown"}
Source: ${article.siteName || "Unknown"}

Task:
${instructions[summaryType] || instructions.brief}

Article:
${truncateArticle(article.text)}
  `.trim();
}

export async function getGeminiSummary(article, summaryType, apiKey) {
  const prompt = buildPrompt(article, summaryType);

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],

      generationConfig: {
        temperature: 0.2,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Gemini API request failed with status ${response.status}.`,
    );
  }

  const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!summary) {
    throw new Error("Gemini did not return a summary.");
  }

  return summary;
}
