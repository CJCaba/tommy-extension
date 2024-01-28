import {embedReactApp} from './embedReactApp';
import {FilteredDOM} from './filteredDOM'

// Execute the Function for
embedReactApp();


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "filterDOM":
            FilteredDOM();
            break;
        default:
            break;
    }
});