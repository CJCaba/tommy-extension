/**
 * Using a elementSelector to select the first match element,
 * use scrollIntoView to scroll to that element.
 *
 * @param tommyKey:(Strting), unique data attribute to find element
 */



export function scrollToElement(tommyKey:string) {
    // Use an attribute selector to find the element with the given data-tommy-key value
    const element = document.querySelector(`[data-tommy-key="${tommyKey}"]`);

    // Check if the element exists
    if (element) {
        // If the element is found, scroll to it
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.error("I am here")
    } else {
        // Log an error message if the element is not found
        console.error('Element with data-tommy-key not found:', tommyKey);
    }
}

