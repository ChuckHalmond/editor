import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemCollection } from "./MenuItemCollection";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
export { HTMLEMenuElement };
export { EMenu };
interface HTMLEMenuElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLEMenuItemCollection;
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    contextual: boolean;
    contextX: number;
    contextY: number;
}
interface HTMLEMenuElementConstructor {
    readonly prototype: HTMLEMenuElement;
    new (): HTMLEMenuElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menu": HTMLEMenuElement;
    }
}
declare var HTMLEMenuElement: HTMLEMenuElementConstructor;
interface EMenuConstructor {
    readonly prototype: HTMLEMenuElement;
    new (init: {
        name?: string;
        children?: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement | HTMLHRElement)[];
    }): HTMLEMenuElement;
}
declare var EMenu: EMenuConstructor;
