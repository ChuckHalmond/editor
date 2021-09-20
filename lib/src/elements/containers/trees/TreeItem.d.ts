import { HTMLETreeElement } from "./Tree";
export { HTMLETreeItemElement };
export { HTMLETreeItemElementBase };
interface HTMLETreeItemElement extends HTMLElement {
    name: string;
    label: string;
    expanded: boolean;
    indent: number;
    icon: string;
    active: boolean;
    leaf: boolean;
    items: HTMLETreeItemElement[];
    parent: HTMLETreeItemElement | HTMLETreeElement | null;
    deepestVisibleChildItem(): HTMLETreeItemElement;
    previousVisibleItem(): HTMLETreeItemElement;
    nextVisibleItem(): HTMLETreeItemElement;
    nearestParentItem(): HTMLETreeItemElement;
    toggle(): void;
    trigger(): void;
}
declare class HTMLETreeItemElementBase extends HTMLElement implements HTMLETreeItemElement {
    name: string;
    label: string;
    indent: number;
    expanded: boolean;
    value: string;
    icon: string;
    active: boolean;
    leaf: boolean;
    items: HTMLETreeItemElement[];
    parent: HTMLETreeItemElement | HTMLETreeElement | null;
    private _toggleArrow;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    deepestVisibleChildItem(): HTMLETreeItemElement;
    previousVisibleItem(): HTMLETreeItemElement;
    nextVisibleItem(): HTMLETreeItemElement;
    nearestParentItem(): HTMLETreeItemElement;
    toggle(): void;
    trigger(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement;
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
