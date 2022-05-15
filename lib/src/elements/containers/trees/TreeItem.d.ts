import { HTMLETreeItemGroupElement } from "./TreeItemGroup";
export { HTMLETreeItemElement };
interface HTMLETreeItemElementConstructor {
    readonly prototype: HTMLETreeItemElement;
    new (): HTMLETreeItemElement;
}
interface HTMLETreeItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly group: HTMLETreeItemGroupElement | null;
    name: string;
    posinset: number;
    label: string;
    droptarget: boolean;
    expanded: boolean;
    selected: boolean;
    active: boolean;
    level: number;
    type: "leaf" | "parent";
    toggle(force?: boolean): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement;
    }
}
declare var HTMLETreeItemElement: HTMLETreeItemElementConstructor;
