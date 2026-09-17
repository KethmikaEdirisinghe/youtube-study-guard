console.log("YouTube Study Guard background is running!");

let allowedYouTubeTabs = new Set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "YOUTUBE_DETECTED") {
        console.log("Youtube was detected");
        console.log("URL:", message.url);
    }

    if (message.type === "YOUTUBE_NAVIGATION") {
        console.log("Youtube navigation detected");
        console.log("New URL:", message.url);
    }

    if (message.type === "VIDEO_OPENED") {
        console.log("VIDEO_OPENED");
        console.log("Video URL:", message.url);
    }

    if (message.type === "ALLOW_YOUTUBE") {
        const tabId = sender.tab.id;

        console.log("User has a real purpose.");
        console.log("Allowing YouTube for tab:", tabId);

        allowedYouTubeTabs.add(tabId);
    }

    if (message.type === "CHECK_YOUTUBE_ACCESS") {
        const tabId = sender.tab.id;

        const allowed = allowedYouTubeTabs.has(tabId);

        console.log(
            "Checking YouTube access for tab:",
            tabId,
            "Allowed:",
            allowed
        );

        sendResponse({
            allowed: allowed
        });

        return true;
    }

    // Close the Study Guard tab
    if (message.type === "CLOSE_GUARD_TAB") {
        const tabId = sender.tab.id;

        console.log("Closing Study Guard tab:", tabId);

        chrome.tabs.remove(tabId);
    }    
});

function isYouTube(url) {
    return url.startsWith("https://www.youtube.com/");
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {

    if (details.frameId !== 0) {
        return;
    }

    if (isYouTube(details.url)) {

        if (allowedYouTubeTabs.has(details.tabId)) {
            console.log(
                "YouTube allowed for tab:",
                details.tabId
            );

            return;
        }

        console.log(
            "YouTube detected! Redirecting to Study Guard..."
        );

        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("guard.html")
        });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    allowedYouTubeTabs.delete(tabId);
});