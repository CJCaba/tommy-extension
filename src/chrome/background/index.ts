chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "tabAction") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id as number, {action: message.action, ...message.args});
        });
    }
});
