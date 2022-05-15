import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemCollection } from "./MenuItemCollection";
export { HTMLEMenuBarElement };
interface HTMLEMenuBarElementConstructor {
    readonly prototype: HTMLEMenuBarElement;
    new (): HTMLEMenuBarElement;
}
interface HTMLEMenuBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLEMenuItemCollection;
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    active: boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement;
    }
}
declare var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor;
