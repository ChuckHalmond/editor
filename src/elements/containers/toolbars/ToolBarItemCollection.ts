import { HTMLEToolBarElement } from "./ToolBar";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
import { HTMLEToolBarItemGroupElement } from "./ToolBarItemGroup";

export { HTMLEToolBarItemRadioList };
export { HTMLEToolBarItemCollection };

interface HTMLEToolBarItemCollectionConstructor {
    readonly prototype: HTMLEToolBarItemCollection;
    new(root: HTMLEToolBarElement): HTMLEToolBarItemCollection;
}

interface HTMLEToolBarItemCollection {
    length: number;
    item(index: number): HTMLEToolBarItemElement | null;
    namedItem(name: string): HTMLEToolBarItemElement | HTMLEToolBarItemRadioList | null;
    values(): IterableIterator<HTMLEToolBarItemElement>;
}

interface HTMLEToolBarItemRadioListConstructor {
    readonly prototype: HTMLEToolBarItemRadioList;
    new(root: HTMLEToolBarElement, name: string): HTMLEToolBarItemRadioList;
}

interface HTMLEToolBarItemRadioList {
    value: string;
    values(): IterableIterator<HTMLEToolBarItemElement>;
}

class HTMLEToolBarItemCollectionBase implements HTMLEToolBarItemCollection {
    #walker: TreeWalker;

    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    constructor(root: HTMLEToolBarElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEToolBarItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEToolBarItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLEToolBarItemElement | null {
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
        return <HTMLEToolBarItemElement | null>currentNode;
    }

    namedItem(name: string): HTMLEToolBarItemElement | HTMLEToolBarItemRadioList | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = <HTMLEToolBarItemElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLEToolBarItemElement | null>walker.nextNode();
        }
        if (currentNode && currentNode.type == "radio") {
            return new HTMLEToolBarItemRadioList(<HTMLEToolBarElement>walker.root, name);
        }
        return <HTMLEToolBarItemElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLEToolBarItemElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLEToolBarItemElement>currentNode;
            currentNode = walker.nextNode();
        }
    }

    static HTMLEToolBarItemRadioListBase? = class HTMLEToolBarItemRadioListBase implements HTMLEToolBarItemRadioList {
        #walker: TreeWalker;
        #name: string;

        get value(): string {
            const name = this.#name;
            const walker = this.#walker;
            walker.currentNode = walker.root;
            let currentNode = <HTMLEToolBarItemElement | null>walker.nextNode();
            while (currentNode !== null) {
                if (currentNode.name == name && currentNode.type == "radio" && currentNode.checked) {
                    return currentNode.value;
                }
                currentNode = <HTMLEToolBarItemElement | null>walker.nextNode();
            }
            return "";
        }

        constructor(root: HTMLEToolBarElement, name: string) {
            this.#walker = document.createTreeWalker(
                root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
            );
            this.#name = name;
        }
        
        #nodeFilter(node: Node): number {
            if (node instanceof HTMLEToolBarItemElement) {
                return NodeFilter.FILTER_ACCEPT;
            }
            if (node instanceof HTMLEToolBarItemGroupElement) {
                return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_REJECT;
        }

        *values(): IterableIterator<HTMLEToolBarItemElement> {
            const name = this.#name;
            const walker = this.#walker;
            walker.currentNode = walker.root;
            let currentNode = <HTMLEToolBarItemElement | null>walker.nextNode();
            while (currentNode !== null) {
                const {name: itemName, type: itemType} = currentNode;
                if (itemName == name && itemType == "radio") {
                    yield currentNode;
                }
                currentNode = <HTMLEToolBarItemElement | null>walker.nextNode();
            }
        }
    }
}

var HTMLEToolBarItemCollection: HTMLEToolBarItemCollectionConstructor =  HTMLEToolBarItemCollectionBase;
var HTMLEToolBarItemRadioList: HTMLEToolBarItemRadioListConstructor = HTMLEToolBarItemCollectionBase.HTMLEToolBarItemRadioListBase!;
delete HTMLEToolBarItemCollectionBase.HTMLEToolBarItemRadioListBase;