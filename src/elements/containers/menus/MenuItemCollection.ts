import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuBarElement } from "./MenuBar";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuItemRadioList };
export { HTMLEMenuItemCollection };

interface HTMLEMenuItemCollectionConstructor {
    readonly prototype: HTMLEMenuItemCollection;
    new(root: HTMLEMenuElement | HTMLEMenuBarElement): HTMLEMenuItemCollection;
}

interface HTMLEMenuItemCollection {
    length: number;
    item(index: number): HTMLEMenuItemElement | null;
    namedItem(name: string): HTMLEMenuItemElement | HTMLEMenuItemRadioList | null;
    values(): IterableIterator<HTMLEMenuItemElement>;
}

interface HTMLEMenuItemRadioListConstructor {
    readonly prototype: HTMLEMenuItemRadioList;
    new(root: HTMLEMenuElement | HTMLEMenuBarElement, name: string): HTMLEMenuItemRadioList;
}

interface HTMLEMenuItemRadioList {
    value: string;
    values(): IterableIterator<HTMLEMenuItemElement>;
}

class HTMLEMenuItemCollectionBase implements HTMLEMenuItemCollection {
    #walker: TreeWalker;

    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    constructor(root: HTMLEMenuElement | HTMLEMenuBarElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEMenuItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEMenuItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    item(index: number): HTMLEMenuItemElement | null {
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
        return <HTMLEMenuItemElement | null>currentNode;
    }

    namedItem(name: string): HTMLEMenuItemElement | HTMLEMenuItemRadioList | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        let currentNode = <HTMLEMenuItemElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = <HTMLEMenuItemElement | null>walker.nextNode();
        }
        if (currentNode?.type == "radio") {
            return new HTMLEMenuItemRadioList(<HTMLEMenuElement | HTMLEMenuBarElement>root, name);
        }
        return <HTMLEMenuItemElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLEMenuItemElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLEMenuItemElement>currentNode;
            currentNode = walker.nextNode();
        }
    }

    static HTMLEMenuItemRadioListBase? = class HTMLEMenuItemRadioListBase implements HTMLEMenuItemRadioList {
        #walker: TreeWalker;
        #name: string;

        get value(): string {
            const name = this.#name;
            const walker = this.#walker;
            walker.currentNode = walker.root;
            let currentNode = <HTMLEMenuItemElement | null>walker.nextNode();
            while (currentNode !== null) {
                if (currentNode.name == name && currentNode.type == "radio" && currentNode.checked) {
                    return currentNode.value;
                }
                currentNode = <HTMLEMenuItemElement | null>walker.nextNode();
            }
            return "";
        }

        constructor(root: HTMLEMenuElement | HTMLEMenuBarElement, name: string) {
            this.#walker = document.createTreeWalker(
                root, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
            );
            this.#name = name;
        }
        
        #nodeFilter(node: Node): number {
            if (node instanceof HTMLEMenuItemElement) {
                return NodeFilter.FILTER_ACCEPT;
            }
            if (node instanceof HTMLEMenuItemGroupElement) {
                return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_REJECT;
        }

        *values(): IterableIterator<HTMLEMenuItemElement> {
            const name = this.#name;
            const walker = this.#walker;
            walker.currentNode = walker.root;
            let currentNode = <HTMLEMenuItemElement | null>walker.nextNode();
            while (currentNode !== null) {
                const {name: itemName, type: itemType} = currentNode;
                if (itemName == name && itemType == "radio") {
                    yield currentNode;
                }
                currentNode = <HTMLEMenuItemElement | null>walker.nextNode();
            }
        }
    }
}

var HTMLEMenuItemCollection: HTMLEMenuItemCollectionConstructor =  HTMLEMenuItemCollectionBase;
var HTMLEMenuItemRadioList: HTMLEMenuItemRadioListConstructor = HTMLEMenuItemCollectionBase.HTMLEMenuItemRadioListBase!;
delete HTMLEMenuItemCollectionBase.HTMLEMenuItemRadioListBase;