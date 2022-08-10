import { HTMLEGridElement } from "./Grid";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridRowGroupElement } from "./GridRowGroup";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridBodyElement } from "./GridBody";

export { HTMLEGridCellCollection };

interface HTMLEGridCellCollectionConstructor {
    prototype: HTMLEGridCellCollection;
    new(root: HTMLElement): HTMLEGridCellCollection;
}

interface HTMLEGridCellCollection {
    length: number;
    item(index: number): HTMLEGridCellElement | null;
    namedItem(name: string): HTMLEGridCellElement | null;
    values(): IterableIterator<HTMLEGridCellElement>;
}

class HTMLEGridCellCollectionBase implements HTMLEGridCellCollection {
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
        if (node instanceof HTMLEGridCellElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEGridBodyElement) {
            return NodeFilter.FILTER_SKIP;
        }
        if (node instanceof HTMLEGridRowGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        if (node instanceof HTMLEGridRowElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLEGridCellElement | null {
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
        return <HTMLEGridCellElement | null>currentNode;
    }

    namedItem(name: string): HTMLEGridCellElement | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = <HTMLEGridCellElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLEGridCellElement | null>walker.nextNode();
        }
        return <HTMLEGridCellElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLEGridCellElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLEGridCellElement>currentNode;
            currentNode = walker.nextNode();
        }
    }
}

var HTMLEGridCellCollection: HTMLEGridCellCollectionConstructor =  HTMLEGridCellCollectionBase;