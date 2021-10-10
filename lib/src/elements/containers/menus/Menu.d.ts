import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
export { HTMLEMenuElement };
interface HTMLEMenuElement extends HTMLElement {
    name: string;
    expanded: boolean;
    overflowing: boolean;
    parentItem: HTMLEMenuItemElement | null;
    items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
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
