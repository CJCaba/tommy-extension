export const callScript = (action: any, args = {}) => {
    const event = new CustomEvent('myExtensionEvent', {
        detail: {action, args}
    });
    window.dispatchEvent(event);
};
