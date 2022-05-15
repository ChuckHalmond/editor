import { HTMLEListElement } from "./List";
import { HTMLEListItemElement } from "./ListItem";
import { HTMLEListItemGroupElement } from "./ListItemGroup";

export { HTMLEListItemCollection };

interface HTMLEListItemCollectionConstructor {
    readonly prototype: HTMLEListItemCollection;
    new(root: HTMLEListElement): HTMLEListItemCollection;
}

interface HTMLEListItemCollection {
    length: number;
    item(index: number): HTMLEListItemElement | null;
    namedItem(name: string): HTMLEListItemElement | null;
    values(): IterableIterator<HTMLEListItemElement>;
}

class HTMLEListItemCollectionBase implements HTMLEListItemCollection {
    #walker: TreeWalker;

    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    constructor(root: HTMLEListElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEListItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEListItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLEListItemElement | null {
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
        return <HTMLEListItemElement | null>currentNode;
    }

    namedItem(name: string): HTMLEListItemElement | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = <HTMLEListItemElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLEListItemElement | null>walker.nextNode();
        }
        return <HTMLEListItemElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLEListItemElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLEListItemElement>currentNode;
            currentNode = walker.nextNode();
        }
    }
}

var HTMLEListItemCollection: HTMLEListItemCollectionConstructor =  HTMLEListItemCollectionBase;