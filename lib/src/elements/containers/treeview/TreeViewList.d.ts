import { HTMLETreeViewItemElement } from "./TreeViewItem";
export { HTMLETreeViewListElement };
export { HTMLETreeViewListElementBase };
interface HTMLETreeViewListElement extends HTMLElement {
    name: string;
    items: HTMLETreeViewItemElement[];
    readonly activeItem: HTMLETreeViewItemElement | null;
}
declare class HTMLETreeViewListElementBase extends HTMLElement implements HTMLETreeViewListElement {
    active: boolean;
    name: string;
    items: HTMLETreeViewItemElement[];
    private _activeItem;
    constructor();
    get activeItem(): HTMLETreeViewItemElement | null;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeviewlist": HTMLETreeViewListElement;
    }
}
