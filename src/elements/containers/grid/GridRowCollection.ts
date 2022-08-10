import { HTMLEGridElement } from "./Grid";
import { HTMLEGridRowGroupElement } from "./GridRowGroup";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridBodyElement } from "./GridBody";

export { HTMLEGridRowCollection };

interface HTMLEGridRowCollectionConstructor {
    prototype: HTMLEGridRowCollection;
    new(root: HTMLElement): HTMLEGridRowCollection;
}

interface HTMLEGridRowCollection {
    length: number;
    item(index: number): HTMLEGridRowElement | null;
    namedItem(name: string): HTMLEGridRowElement | null;
    values(): IterableIterator<HTMLEGridRowElement>;
}

class HTMLEGridRowCollectionBase implements HTMLEGridRowCollection {
    #walker: TreeWalker;
    
    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    constructor(root: HTMLElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEGridBodyElement) {
            return NodeFilter.FILTER_SKIP;
        }
        if (node instanceof HTMLEGridRowElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEGridRowGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLEGridRowElement | null {
        if (index < 0) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        let i = 0;
        while (i < index && currentNode !== null) {
            currentNode = walker.nextNode();
            i++;
        }
        return <HTMLEGridRowElement | null>currentNode;
    }

    namedItem(name: string): HTMLEGridRowElement | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = <HTMLEGridRowElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLEGridRowElement | null>walker.nextNode();
        }
        return <HTMLEGridRowElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLEGridRowElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLEGridRowElement>currentNode;
            currentNode = walker.nextNode();
        }
    }
}

var HTMLEGridRowCollection: HTMLEGridRowCollectionConstructor =  HTMLEGridRowCollectionBase;