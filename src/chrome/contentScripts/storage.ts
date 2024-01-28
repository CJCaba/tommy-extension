export function SetDataToStorage(key: string, value: string, callback: any) {
    chrome.storage.local.set({[key]: value}, function () {
        console.log('Value is set to ' + value);
        if (callback) callback();
    });
}

export function GetDataFromStorage(key: string, callback: any) {
    chrome.storage.local.get([key], function (result) {
        console.log('Value currently is ' + result[key]);
        callback(result[key]);
    });
}
