import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionGroupElement } from "./OptionGroup";
import { HTMLESelectElement } from "./Select";

export { HTMLEOptionCollection };

interface HTMLEOptionCollectionConstructor {
    prototype: HTMLEOptionCollection;
    new(root: HTMLESelectElement): HTMLEOptionCollection;
}

interface HTMLEOptionCollection {
    length: number;
    item(index: number): HTMLEOptionElement | null;
    namedItem(name: string): HTMLEOptionElement | null;
    values(): IterableIterator<HTMLEOptionElement>;
}

class HTMLEOptionCollectionBase implements HTMLEOptionCollection {
    #walker: TreeWalker;

    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    get value(): string {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = <HTMLEOptionElement | null>walker.nextNode();
        while (currentNode !== null) {
            if (currentNode.selected) {
                return currentNode.value;
            }
            currentNode = <HTMLEOptionElement | null>walker.nextNode();
        }
        return "";
    }

    constructor(root: HTMLESelectElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEOptionElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEOptionGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLEOptionElement | null {
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
        return <HTMLEOptionElement | null>currentNode;
    }

    namedItem(name: string): HTMLEOptionElement | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        let currentNode = <HTMLEOptionElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLEOptionElement | null>walker.nextNode();
        }
        return <HTMLEOptionElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLEOptionElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLEOptionElement>currentNode;
            currentNode = walker.nextNode();
        }
    }
}

var HTMLEOptionCollection: HTMLEOptionCollectionConstructor =  HTMLEOptionCollectionBase;