console.log("YouTube Study Guard background is running!");

chrome.runtime.onMessage.addListener((message) =>{
    if(message.type === "YOUTUBE_DETECTED"){
        console.log("Youtube was detected");
        console.log("URL:",message.url);
    }

    if(message.type === "YOUTUBE_NAVIGATION"){
        console.log("Youtube navigation detected");
        console.log("New URL:",message.url);    
    }

    if(message.type === "VIDEO_OPENED"){
    console.log("VIDEO_OPENED");
    console.log("Video URL:",message.url);

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
        console.log("YouTube detected! Redirecting to Study Guard...");

        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("guard.html")
        });
    }
});


