import { HTMLETreeElement } from "./Tree";
import { HTMLETreeItemElement } from "./TreeItem";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";

export { HTMLETreeItemCollection };

interface HTMLETreeItemCollectionConstructor {
    readonly prototype: HTMLETreeItemCollection;
    new(root: HTMLETreeElement): HTMLETreeItemCollection;
}

interface HTMLETreeItemCollection {
    length: number;
    item(index: number): HTMLETreeItemElement | null;
    namedItem(name: string): HTMLETreeItemElement | null;
    values(): IterableIterator<HTMLETreeItemElement>;
}

class HTMLETreeItemCollectionBase implements HTMLETreeItemCollection {
    #walker: TreeWalker;

    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    constructor(root: HTMLETreeElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLETreeItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLETreeItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLETreeItemElement | null {
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
        return <HTMLETreeItemElement | null>currentNode;
    }

    namedItem(name: string): HTMLETreeItemElement | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = <HTMLETreeItemElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLETreeItemElement | null>walker.nextNode();
        }
        return <HTMLETreeItemElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLETreeItemElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLETreeItemElement>currentNode;
            currentNode = walker.nextNode();
        }
    }
}

var HTMLETreeItemCollection: HTMLETreeItemCollectionConstructor =  HTMLETreeItemCollectionBase;