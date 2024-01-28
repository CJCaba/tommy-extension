import {CloseCurrentTab, OpenTab} from "./TabControls";
import {clickOnElement} from "./ClickOnElement";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "clickElement":
            clickOnElement(request.selector);
            break;
        case "CloseCurrentTab":
            CloseCurrentTab();
            break;
        case "OpenTab":
            OpenTab();
            break;
        default:
            break;
    }
});