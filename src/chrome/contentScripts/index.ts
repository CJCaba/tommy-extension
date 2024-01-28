import {clickOnElement} from './ClickOnElement';
import {CloseCurrentTab, OpenTab} from './TabControls';
import {embedReactApp} from './embedReactApp';
import {FilteredDOM} from './filteredDOM';
import {SpeechText} from  './speechText';

window.addEventListener('myExtensionEvent', (e: any) => {
    chrome.runtime.sendMessage({
        type: "tabAction",
        action: e.detail.action,
        args: e.detail.args
    });
});


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
        case "filterDOM":
            FilteredDOM();
            break;
        case "speechText":
            SpeechText();
            break;
        default:
            break;
    }
});


// Embed React Application into Webpage
embedReactApp();