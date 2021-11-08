import { HTMLETreeItemElement } from "./TreeItem";
export { HTMLETreeElement };
interface HTMLETreeElementConstructor {
    readonly prototype: HTMLETreeElement;
    new (): HTMLETreeElement;
}
interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
    readonly selectedItem: HTMLETreeItemElement | null;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
    reset(): void;
}
declare var HTMLETreeElement: HTMLETreeElementConstructor;
declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement;
    }
}
