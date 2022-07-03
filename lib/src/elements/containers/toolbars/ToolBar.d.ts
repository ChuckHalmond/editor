import { HTMLEToolBarItemElement } from "./ToolBarItem";
export { HTMLEToolBarElement };
interface HTMLEToolBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    items(): HTMLEToolBarItemElement[];
    readonly activeItem: HTMLEToolBarItemElement | null;
    readonly activeIndex: number;
    name: string;
}
interface HTMLEToolbarElementConstructor {
    readonly prototype: HTMLEToolBarElement;
    new (): HTMLEToolBarElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-toolbar": HTMLEToolBarElement;
    }
}
declare var HTMLEToolBarElement: HTMLEToolbarElementConstructor;
