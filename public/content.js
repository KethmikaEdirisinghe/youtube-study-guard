console.log("YouTube Study Guard is running!");

console.log(window.location.href);

console.log(window.location.hostname);

if(window.location.hostname === "www.youtube.com"){
    console.log("We are on YouTube!");

    chrome.runtime.sendMessage({
        type:"YOUTUBE_DETECTED",
        url:window.location.href
    });
  
}

//URL DIFFERENCE VERIFICATION

let currentUrl = window.location.href;

setInterval(()=>{
    if(window.location.href !== currentUrl){
        currentUrl =  window.location.href;

        console.log("URL changed!");
        console.log("NEW URL:", currentUrl);

        if (window.location.pathname === "/watch") {
        console.log("User opened a YouTube video!");

        chrome.runtime.sendMessage({
            type: "VEDIO_OPENED",
            url: currentUrl
        });
    }

        chrome.runtime.sendMessage({
            type: "YOUTUBE_NAVIGATION",
            url: currentUrl
        });
    }
},1000);