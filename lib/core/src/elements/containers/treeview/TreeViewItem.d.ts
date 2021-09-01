import { HTMLETreeViewListElement } from "./TreeViewList";
export { HTMLETreeViewItemElement };
export { HTMLETreeViewItemElementBase };
interface HTMLETreeViewItemElement extends HTMLElement {
    name: string;
    label: string;
    expanded: boolean;
    indent: number;
    icon: string;
    active: boolean;
    items: HTMLETreeViewItemElement[];
    parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;
    deepestVisibleChildItem(): HTMLETreeViewItemElement;
    previousVisibleItem(): HTMLETreeViewItemElement;
    nextVisibleItem(): HTMLETreeViewItemElement;
    nearestParentItem(): HTMLETreeViewItemElement;
    toggle(): void;
    trigger(): void;
}
declare class HTMLETreeViewItemElementBase extends HTMLElement implements HTMLETreeViewItemElement {
    name: string;
    label: string;
    indent: number;
    expanded: boolean;
    value: string;
    icon: string;
    active: boolean;
    leaf: boolean;
    items: HTMLETreeViewItemElement[];
    parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;
    private _toggleArrow;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    deepestVisibleChildItem(): HTMLETreeViewItemElement;
    previousVisibleItem(): HTMLETreeViewItemElement;
    nextVisibleItem(): HTMLETreeViewItemElement;
    nearestParentItem(): HTMLETreeViewItemElement;
    toggle(): void;
    trigger(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeviewitem": HTMLETreeViewItemElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e-toggle": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e-trigger": Event;
    }
}
