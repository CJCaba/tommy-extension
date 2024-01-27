// Name of the ID attribute we will use to identify important information
const TV = "tommy_value"

// A list of currently important tags we want to be aware of
const TAGS =  ["P", "A", "H1", "H2", "H3", "TITLE"];

// A list of all found important nodes transformed into Tommy_Nodes
const SEARCH_NODES = [];

// Class for our data structure holding the important data from nodes
class Tommy_Node {
    tag: Element;
    data: string;
    assoc: Tommy_Node[];
    key: string;
    constructor(tag: Element, data: string, key: string) {
        this.tag = tag;
        this.data = data;
        this.assoc = [];
        this.key = key;
    }

    
}


export function FilteredDOM() {

    // Get the root node of the DOM
    const node = document.documentElement;

    function traverseDOM(node: Node): void{
        // Node is the current DOM node of the file
    
        // First check to determine whether the node is a proper element node
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Then check to see if the nodeName is one of the important tags to mark down
            if (TAGS.includes(element.nodeName)) {
                const new_node = new Tommy_Node(element, element.textContent as string, "random_string");
                element.setAttribute(TV, "random_string");
                SEARCH_NODES.push(new_node);
            }
        }

        // Visit each child of the current node
        node.childNodes.forEach(childNode => {
            traverseDOM(childNode);
        });
    }

    traverseDOM(node);
}

