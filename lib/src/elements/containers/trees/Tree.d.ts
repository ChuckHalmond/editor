import { HTMLETreeItemElement } from "./TreeItem";
import { HTMLETreeItemCollection } from "./TreeItemCOllection";
export { HTMLETreeElement };
interface HTMLETreeElementConstructor {
    readonly prototype: HTMLETreeElement;
    new (): HTMLETreeElement;
}
interface HTMLETreeElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLETreeItemCollection;
    readonly activeItem: HTMLETreeItemElement | null;
    readonly dropTargetItem: HTMLETreeItemElement | null;
    droptarget: boolean;
    name: string;
    selectedItems(): HTMLETreeItemElement[];
    beginSelection(): void;
    endSelection(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement;
    }
}
declare var HTMLETreeElement: HTMLETreeElementConstructor;
