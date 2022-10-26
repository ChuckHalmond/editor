import { HTMLEStatusItemElement } from "./StatusItem";
export { HTMLEStatusBarElement };
interface HTMLEStatusBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEStatusItemElement | null;
    items(): HTMLEStatusItemElement[];
    firstItem(): HTMLEStatusItemElement | null;
}
interface HTMLEToolbarElementConstructor {
    prototype: HTMLEStatusBarElement;
    new (): HTMLEStatusBarElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-statusbar": HTMLEStatusBarElement;
    }
}
declare var HTMLEStatusBarElement: HTMLEToolbarElementConstructor;
