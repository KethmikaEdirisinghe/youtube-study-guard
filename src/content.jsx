import { createRoot } from "react-dom/client";
import StudyGuard from "./study-guard/StudyGuard.jsx";

console.log("YouTube Study Guard is running!");
console.log(window.location.href);
console.log(window.location.hostname);

// --- React UI Injection ---
if (window.location.hostname === "www.youtube.com") {
  console.log("We are on YouTube!");

  chrome.runtime.sendMessage({
    type: "YOUTUBE_DETECTED",
    url: window.location.href,
  });

  // alert("Why are you opening Youtube?");

  // Avoid injecting multiple roots if the script runs again
  if (!document.getElementById("study-guard-root")) {
    const root = document.createElement("div");
    root.id = "study-guard-root";
    document.documentElement.appendChild(root);
    console.log("Study Guard root created!");

    createRoot(root).render(<StudyGuard />);
  }
}

// --- URL DIFFERENCE VERIFICATION ---
let currentUrl = window.location.href;

setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;

    console.log("URL changed!");
    console.log("NEW URL:", currentUrl);

    if (window.location.pathname === "/watch") {
      console.log("User opened a YouTube video!");

      chrome.runtime.sendMessage({
        type: "VIDEO_OPENED",
        url: currentUrl,
      });

      // alert("Why are you opening Youtube?");
    }

    chrome.runtime.sendMessage({
      type: "YOUTUBE_NAVIGATION",
      url: currentUrl,
    });
  }
}, 1000);