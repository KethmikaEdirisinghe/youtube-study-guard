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

    if(message.type === "VEDIO_OPENED"){
    console.log("VEDIO_OPENED");
    console.log("Vedio URL:",message.url);

    }
}); 


