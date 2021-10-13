import { HTMLETreeElement } from "./Tree";
export { HTMLETreeItemElement };
interface HTMLETreeItemElementConstructor {
    readonly prototype: HTMLETreeItemElement;
    new (): HTMLETreeItemElement;
}
interface HTMLETreeItemElement extends HTMLElement {
    name: string;
    label: string;
    expanded: boolean;
    indent: number;
    selected: boolean;
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
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
}
declare var HTMLETreeItemElement: HTMLETreeItemElementConstructor;
declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_toggle": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_trigger": Event;
    }
}
