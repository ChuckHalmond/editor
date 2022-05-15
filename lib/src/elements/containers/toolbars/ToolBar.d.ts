import { HTMLEToolBarItemElement } from "./ToolBarItem";
import { HTMLEToolBarItemCollection } from "./ToolBarItemCollection";
export { HTMLEToolBarElement };
interface HTMLEToolBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLEToolBarItemCollection;
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
