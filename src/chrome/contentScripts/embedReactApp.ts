export function embedReactApp() {
    const reactAppDiv = document.createElement('div');
    reactAppDiv.id = 'react-app';
    reactAppDiv.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 20%;
        height: 100vh;
        z-index: 10000000;
        margin: 0;
        padding: 0;
    `;

    document.body.appendChild(reactAppDiv);

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('react.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
}
