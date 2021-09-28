import { HTMLETreeItemElement } from "./TreeItem";
export { HTMLETreeElement };
export { HTMLETreeElementBase };
interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
}
declare class HTMLETreeElementBase extends HTMLElement implements HTMLETreeElement {
    active: boolean;
    name: string;
    items: HTMLETreeItemElement[];
    private _activeItem;
    constructor();
    get activeItem(): HTMLETreeItemElement | null;
    connectedCallback(): void;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement;
    }
}
