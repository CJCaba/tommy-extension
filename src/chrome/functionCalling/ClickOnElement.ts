/**
 * Clicks on a DOM element specified by a selector.
 * @param selector - The CSS selector of the element to click.
 */
export function clickOnElement(selector: string): void {
    // Find the element using the selector
    const element = document.querySelector(`[data-tommy-key="${selector}"]`);

    // Check if the element exists
    if (element) {
        // Create a mouse event
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        // Dispatch the event on the element
        element.dispatchEvent(event);
    } else {
        console.error(`Element not found for selector: ${selector}`);
    }
}
