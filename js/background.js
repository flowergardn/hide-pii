chrome.webNavigation.onDOMContentLoaded.addListener(({ tabId, url }) => {
    if(!url.includes("chrome://")) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ["js/inject.js"],
        });
    }
});
