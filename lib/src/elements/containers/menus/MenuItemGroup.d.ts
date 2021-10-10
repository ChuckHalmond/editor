import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuItemGroupElement };
interface HTMLEMenuItemGroupElementConstructor {
    readonly prototype: HTMLEMenuItemGroupElement;
    new (): HTMLEMenuItemGroupElement;
}
interface HTMLEMenuItemGroupElement extends HTMLElement {
    name: string;
    label: string;
    type: "list" | "grid";
    rows: number;
    cells: number;
    parentMenu: HTMLEMenuElement | null;
    items: HTMLEMenuItemElement[];
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement;
    }
}
declare var HTMLEMenuItemGroupElement: HTMLEMenuItemGroupElementConstructor;
