/**
 * Tab Controls with functions: OpenTab, CloseTab
 *
 *
 * @constructor
 */

/**
 * Create a empty Tab;
 *
 * @prama: optional prama of a url, if there's an url open new tab to that url,
 * if no url, open a new blank tab.
 *
 *
 */
export function OpenTab(url?: string) {
    // Open a new empty tab. 'about:blank' opens an empty tab.

    if (url) {
        window.open(url);
    } else {
        window.open('about:blank', '_blank');
    }
};

export function CloseCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // `tabs` will be an array with only one element: the active tab in the current window.
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
            chrome.tabs.remove(currentTab.id);
        }
    });
    console.log("closeTab ran")
}

// Function to delete a tab given a unique key
export function deleteTargetTab(key: number) {
    if (key !== undefined) {
        chrome.tabs.remove(key, () => {
            if (chrome.runtime.lastError) {
                console.error('Failed to close tab:', chrome.runtime.lastError.message);
            } else {
                console.log(`Tab with ID ${key} closed.`);
            }
        });
    } else {
        console.error('No tab found for the given key:', key);
    }
}