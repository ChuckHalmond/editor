import { HTMLETreeItemElement } from "./TreeItem";
export { HTMLETreeElement };
export { HTMLETreeElementBase };
interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
    readonly selectedItem: HTMLETreeItemElement | null;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
    reset(): void;
}
declare class HTMLETreeElementBase extends HTMLElement implements HTMLETreeElement {
    active: boolean;
    name: string;
    items: HTMLETreeItemElement[];
    private _activeItem;
    private _selectedItem;
    constructor();
    get activeItem(): HTMLETreeItemElement | null;
    get selectedItem(): HTMLETreeItemElement | null;
    connectedCallback(): void;
    focusItem(item: HTMLETreeItemElement): void;
    selectItem(item: HTMLETreeItemElement): void;
    reset(): void;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement;
    }
}
