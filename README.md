# 🧠 YouTube Study Guard

A Chrome extension that helps you stay focused by intercepting YouTube visits during study sessions. Instead of mindlessly scrolling, it walks you through a self-reflection flow — helping you decide if you truly need YouTube right now or if you're just procrastinating.

## Features

- **Intent Check** — asks _why_ you're opening YouTube before letting you in
- **Study Goal Input** — forces you to define what you want to learn
- **Self-Awareness Prompt** — honest reflection before watching
- **Intentional Break Timer** — 5-minute break with activity suggestions
- **Motivational Close** — encouragement to get back to studying

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)
- Google Chrome or any Chromium-based browser (Edge, Brave, etc.)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/youtube-study-guard.git
cd youtube-study-guard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

This creates a `dist/` folder containing the production-ready extension files.

### 4. Load into Chrome

1. Open your browser and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist` folder from this project

### 5. Try it out

Navigate to [youtube.com](https://www.youtube.com) — the Study Guard overlay will appear instead of YouTube.

## Development

For local development with hot-reload (popup & guard pages only):

```bash
npm run dev
```

> **Note:** The content script and full extension flow only work when loaded as an unpacked extension from the `dist/` folder. After making changes, rebuild and reload:

```bash
npm run build
```

Then click the **🔄 reload** button on your extension card in `chrome://extensions`.

## Project Structure

```
youtube-study-guard/
├── public/
│   ├── manifest.json        # Chrome extension manifest (MV3)
│   ├── background.js        # Service worker for tab/navigation handling
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx             # Popup entry point
│   ├── App.jsx              # Popup UI
│   ├── guard-main.jsx       # Guard page entry point
│   ├── content.jsx          # Content script (injected into YouTube)
│   ├── index.css            # Global styles + animations
│   └── study-guard/
│       ├── StudyGuard.jsx   # Main study guard overlay component
│       └── studyGuardMain.jsx
├── index.html               # Popup HTML
├── guard.html               # Guard page HTML
├── vite.config.js           # Vite config for popup + guard
├── vite.content.config.js   # Vite config for content script
└── package.json
```

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **Lucide React** — Icons
- **Chrome Extensions Manifest V3**

## License

MIT
