import { HTMLETreeItemElement } from "./TreeItem";
export { HTMLETreeElement };
export { HTMLETreeElementBase };
interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
}
declare class HTMLETreeElementBase extends HTMLElement implements HTMLETreeElement {
    active: boolean;
    name: string;
    items: HTMLETreeItemElement[];
    private _activeItem;
    constructor();
    get activeItem(): HTMLETreeItemElement | null;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement;
    }
}
