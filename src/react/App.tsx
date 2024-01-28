import {CloseCurrentTab} from "../chrome/functionCalling/TabControls";

export default function App() {
    const handleClick = () => {
        // Example of passing additional arguments
        callScript("addDogImage", {size: '150px', position: 'bottom-right'});
    };

    const CloseCurrentTab = () =>{
      //testing opening a tab
        console.log("Close Tab Called")
        callScript("CloseCurrentTab", {url:"https://www.youtube.com"})
    };

    return <main>
        <h1>Add a Dog Gif to Webpage</h1>
        <button onClick={() => handleClick()}>Generate Dog Gif</button>
        <button onClick={()=> CloseCurrentTab()}>close current Tab</button>
    </main>
};


export const callScript = (action: any, args = {}) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id as number, {action, ...args});
    });
};

// Lets Add a Function Calling Directory And Test with calling DOG Image.
// Maybe try a wrapper appraoch for each function when calling ContentScripts?
// So Instead of Querying and Sending a Message Here It can do it in the script?