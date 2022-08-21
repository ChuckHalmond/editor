import { HTMLEToolBarItemElement } from "./ToolBarItem";
export { HTMLEToolBarElement };
interface HTMLEToolBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    items(): HTMLEToolBarItemElement[];
    firstItem(): HTMLEToolBarItemElement | null;
    readonly activeItem: HTMLEToolBarItemElement | null;
    readonly activeIndex: number;
    name: string;
}
interface HTMLEToolbarElementConstructor {
    prototype: HTMLEToolBarElement;
    new (): HTMLEToolBarElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-toolbar": HTMLEToolBarElement;
    }
}
declare var HTMLEToolBarElement: HTMLEToolbarElementConstructor;
