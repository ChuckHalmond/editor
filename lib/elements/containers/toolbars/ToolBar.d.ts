import { HTMLEToolBarItemElement } from "./ToolBarItem";
import "./ToolBarItem";
import "./ToolBarItemGroup";
export { HTMLEToolBarElement };
declare type ToolBarOrientation = "horizontal" | "vertical";
interface HTMLEToolBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEToolBarItemElement | null;
    items(): HTMLEToolBarItemElement[];
    firstItem(): HTMLEToolBarItemElement | null;
    name: string;
    orientation: ToolBarOrientation;
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
