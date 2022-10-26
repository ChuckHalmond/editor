import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuBarElement };
interface HTMLEMenuBarElementConstructor {
    prototype: HTMLEMenuBarElement;
    new (): HTMLEMenuBarElement;
}
interface HTMLEMenuBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    items(): HTMLEMenuItemElement[];
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    expanded: boolean;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement;
    }
}
declare var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor;
