import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
export { HTMLEMenuElement };
export { EMenu };
interface HTMLEMenuElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly items: HTMLCollectionOf<HTMLEMenuItemElement>;
    name: string;
    contextual: boolean;
    positionContextual(x: number, y: number): void;
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
