import {clickOnElement} from './ClickOnElement';
import {CloseCurrentTab, OpenTab} from './TabControls';
import {embedReactApp} from './embedReactApp';
import {FilteredDOM} from './filteredDOM';
import {SpeechText} from './speechText';
import {GetDataFromStorage, SetDataToStorage} from './storage';

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
        case "getDataFromStorage":
            GetDataFromStorage(request.key, (result: any) => {
                const event = new CustomEvent('myExtensionResponse', {
                    detail: {action: 'getDataFromStorage', status: 'success', value: result}
                });
                window.dispatchEvent(event);
            });
            return true;
        case "setDataToStorage":
            SetDataToStorage(request.key, request.value, () => {
                const event = new CustomEvent('myExtensionResponse', {
                    detail: {action: 'setDataToStorage', status: 'success'}
                });
                window.dispatchEvent(event);
            });
            return true;
        default:
            break;
    }
});

// Embed React Application into Webpage
embedReactApp();