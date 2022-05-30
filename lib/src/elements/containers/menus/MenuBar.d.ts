import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuBarElement };
interface HTMLEMenuBarElementConstructor {
    readonly prototype: HTMLEMenuBarElement;
    new (): HTMLEMenuBarElement;
}
interface HTMLEMenuBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLCollectionOf<HTMLEMenuItemElement>;
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    expanded: boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement;
    }
}
declare var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor;
