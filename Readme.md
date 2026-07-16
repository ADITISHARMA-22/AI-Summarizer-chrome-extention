# 🚀 AI Article Summarizer Chrome Extension

> Instantly summarize online articles using Google's Gemini AI with intelligent article extraction, smart caching, Markdown export, and a modern Chrome Extension experience.

<p align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Gemini API](https://img.shields.io/badge/Google-Gemini_AI-red)
![Mozilla Readability](https://img.shields.io/badge/Mozilla-Readability-orange)

</p>

---

## ✨ Features

### 🤖 AI Powered Summaries

- Generate AI summaries using **Google Gemini**
- Multiple summary modes:
  - Brief Summary
  - Detailed Summary
  - Bullet Point Summary

---

### 📄 Smart Article Extraction

Instead of relying on simple HTML selectors, this extension uses **Mozilla Readability** to accurately extract article content from websites like:

- Medium
- BBC
- Dev.to
- Wikipedia
- News websites
- Blogs

This significantly improves summary quality.

---

### ⚡ Intelligent Caching

Avoid unnecessary API calls.

The extension automatically caches summaries based on:

- Article URL
- Summary Type

If the same article is summarized again, the cached version is returned instantly.

Benefits:

- Faster summaries
- Reduced API usage
- Better user experience

---

### 📝 Markdown Export

Export summaries as a Markdown file.

Perfect for:

- Note taking
- Documentation
- Obsidian
- GitHub
- Notion
- Personal knowledge bases

---

### 📚 Summary History

Recently generated summaries are stored locally.

Users can:

- Reopen previous summaries
- Restore them instantly
- Clear history anytime

---

### 📖 Reading Time Estimation

Displays estimated reading time for the original article.

Helps users understand how much time they're saving.

---

### 🎨 Modern User Experience

- Responsive popup UI
- Loading animations
- Error handling
- Copy to Clipboard
- Settings page
- Clean and minimal interface

---

## 🖼 Screenshots

### Popup

> _(Add screenshot here)_

```
screenshots/popup.png
```

---

### Generated Summary

> _(Add screenshot here)_

```
screenshots/bbc-summary.png
```

```
screenshots/generatingsummary.png
```

```
screenshots/aisummary.png
```

---

### Settings Page

> _(Add screenshot here)_

```
screenshots/ai-summary-settings.png
```

---

## 🏗 Project Architecture

```
popup/
│
├── popup.html
├── popup.css
├── popup.js
├── article.js
├── gemini.js
├── storage.js
├── history.js
├── markdown.js
└── ui.js
```

Each module has a single responsibility.

| Module      | Responsibility             |
| ----------- | -------------------------- |
| popup.js    | Main controller            |
| article.js  | Article extraction helpers |
| gemini.js   | Gemini API communication   |
| storage.js  | Cache management           |
| history.js  | Summary history            |
| markdown.js | Markdown export            |
| ui.js       | UI rendering               |

---

## ⚙️ How It Works

```
Open Article

        ↓

Mozilla Readability

        ↓

Extract Article

        ↓

Generate Cache Key
(URL + Summary Type)

        ↓

Is Summary Cached?

      ↙       ↘

   YES         NO

   ↓            ↓

Return       Gemini API

Cached          ↓

Summary     Generate Summary

      ↘      ↙

 Save Summary

        ↓

Display Result
```

---

## 🛠 Tech Stack

- JavaScript (ES6 Modules)
- HTML5
- CSS3
- Chrome Extension Manifest V3
- Google Gemini API
- Mozilla Readability
- Chrome Storage API
- Fetch API
- Clipboard API
- Blob API

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-article-summarizer.git
```

---

### Load Extension

1. Open Chrome

2. Visit

```
chrome://extensions
```

3. Enable

```
Developer Mode
```

4. Click

```
Load unpacked
```

5. Select the project folder.

---

### Add Gemini API Key

1. Open Extension Settings

2. Enter your Gemini API Key

3. Save

Done 🎉

---

## 💡 Why Mozilla Readability?

Most Chrome extensions simply do:

```javascript
document.querySelector("article");
```

This fails on many websites.

Mozilla Readability intelligently extracts the primary article content while removing:

- Navigation
- Ads
- Sidebars
- Comments
- Footers

Resulting in significantly better AI summaries.

---

## ⚡ Performance Optimizations

Implemented several optimizations to improve user experience:

- Summary caching
- URL normalization
- Cache expiration
- Duplicate request prevention
- Modular architecture
- Optimized article extraction

---

## 🔮 Future Improvements

- PDF Export
- Dark Mode
- Keyboard Shortcuts
- Context Menu Integration
- Stream Gemini Responses
- YouTube Transcript Summarization
- Multi-language Support
- AI Chat with Article
- Cloud Sync using Supabase/Firebase

---

## 📚 What I Learned

While building this project, I explored:

- Chrome Extension Development
- Manifest V3
- Content Scripts
- Background Service Workers
- Chrome Storage API
- ES6 Modules
- Mozilla Readability
- Gemini API Integration
- Browser Messaging
- Markdown Generation
- Browser File Downloads
- Client-side Caching Strategies
- Modular JavaScript Architecture

---

## 👨‍💻 Author

**Aditi Sharma**

Frontend Developer

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
