// Name of the ID attribute we will use to identify important information
const TV = "tommy_value";

// A list of currently important tags we want to be aware of
const TAGS = ["P", "A", "H1", "H2", "H3", "TITLE", "SPAN", "BUTTON"];

// A list of all found important nodes transformed into Tommy_Nodes
let SEARCH_NODES: Tommy_Node[] = [];

// Class for our data structure holding the important data from nodes
class Tommy_Node {
    type: string;
    data: string;
    assoc: string[]; // Keys of associated elements
    key: string;
    parentKey?: string; // Key for the parent

    constructor(type: string, data: string, key: string, parentKey?: string) {
        this.type = type;
        this.data = data;
        this.assoc = [];
        this.key = key;
        this.parentKey = parentKey;
    }
}

function generateRandomString() {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function traverseDOM(node: Node, parentKey?: string): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (TAGS.includes(element.nodeName)) {
            const key = generateRandomString();
            const new_node = new Tommy_Node(element.nodeName, element.textContent || '', key, parentKey);
            element.setAttribute(TV, key);
            SEARCH_NODES.push(new_node);
        }
    }

    node.childNodes.forEach(childNode => {
        const parentNode = node as HTMLElement;
        const parentKey: string = parentNode.getAttribute(TV) as string;
        traverseDOM(childNode, parentKey);
    });
}

function dispatchSearchNodes() {
    // Dispatch a custom event with SEARCH_NODES
    const event = new CustomEvent('myExtensionSearchNodes', {
        detail: {searchNodes: SEARCH_NODES}
    });
    window.dispatchEvent(event);
}

export function FilteredDOM() {
    // Clear previous SEARCH_NODES and reinitialize
    SEARCH_NODES = [];
    const bodyNode = document.body;
    const key = generateRandomString();
    const parent = new Tommy_Node(bodyNode.nodeName, bodyNode.textContent || '', key);

    // Initialize the MutationObserver
    const observer = new MutationObserver(() => {
        SEARCH_NODES = []; // Clear the SEARCH_NODES before re-traversing
        traverseDOM(bodyNode);
        dispatchSearchNodes(); // Dispatch the updated SEARCH_NODES
    });

    // Observe the entire DOM for changes
    observer.observe(document.body, {childList: true, subtree: true});

    // Initial traversal
    traverseDOM(bodyNode, key);
    dispatchSearchNodes(); // Dispatch the initial SEARCH_NODES
}
