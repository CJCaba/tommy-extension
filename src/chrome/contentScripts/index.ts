// export * from './integrateIntoSite';
import {CloseCurrentTab, OpenTab} from "../functionCalling/TabControls";

export * from './filteredDOM';

// Function Calling - Utility Methods
import {addDogImageToScreen, clickOnElement,  } from '../functionCalling';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "addDogImage":
            console.log("ADDING DOG IMAGE TO SCREEN!")
            addDogImageToScreen(request.size, request.position);
            break;
        case "clickElement":
            clickOnElement(request.selector);
            break;

        case"CloseCurrentTab":
            CloseCurrentTab();
        // ... other cases Such as IntegrateIntoSite & FilterDOM
    }
});
