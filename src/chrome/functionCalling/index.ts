import {addDogImageToScreen} from "./AddDogImageToScreen";
import {clickOnElement} from "./ClickOnElement";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "addDogImage":
            addDogImageToScreen(request.size, request.position);
            break;
        case "clickElement":
            clickOnElement(request.selector);
            break;
    }
});