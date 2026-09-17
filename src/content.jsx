import { createRoot } from "react-dom/client";
import "./index.css";
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


    // Ask background if this tab is already allowed

    chrome.runtime.sendMessage(
        {
            type: "CHECK_YOUTUBE_ACCESS"
        },
        (response) => {

            if (response && response.allowed) {

                console.log("This tab is allowed. Study Guard will not appear.");

                return;
            }


            // User is not allowed yet, so show Study Guard

            if (!document.getElementById("study-guard-root")) {

                const root = document.createElement("div");

                root.id = "study-guard-root";

                document.documentElement.appendChild(root);

                console.log("Study Guard root created!");

                createRoot(root).render(<StudyGuard />);
            }
        }
    );
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
        }


        chrome.runtime.sendMessage({
            type: "YOUTUBE_NAVIGATION",
            url: currentUrl,
        });
    }

}, 1000);