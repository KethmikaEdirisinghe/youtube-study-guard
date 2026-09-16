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

if (message.type === "ALLOW_YOUTUBE") {
    console.log("User has a real purpose. YouTube allowed once.");

    allowYouTubeOnce = true;
}

});

let allowYouTubeOnce = false;

function isYouTube(url) {
    return url.startsWith("https://www.youtube.com/");
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId !== 0) {
        return;
    }

    if (isYouTube(details.url)) {

        if (allowYouTubeOnce) {
            console.log("YouTube allowed once.");

            allowYouTubeOnce = false;

            return;
        }

        console.log("YouTube detected! Redirecting to Study Guard...");

        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("guard.html")
        });
    }
});

