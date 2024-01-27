// export * from './integrateIntoSite';
export * from './filteredDOM';

// Function Calling - Utility Methods
import {addDogImageToScreen, clickOnElement} from '../functionCalling';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "addDogImage":
            console.log("ADDING DOG IMAGE TO SCREEN!")
            addDogImageToScreen(request.size, request.position);
            break;
        case "clickElement":
            clickOnElement(request.selector);
            break;
        // ... other cases Such as IntegrateIntoSite & FilterDOM
    }
});
