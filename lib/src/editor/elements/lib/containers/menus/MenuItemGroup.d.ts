import { HTMLEMenuItemElement } from "src/editor/elements/lib/containers/menus/MenuItem";
import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuItemGroupElement };
export { HTMLEMenuItemGroupElementBase };
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
    focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
}
declare class HTMLEMenuItemGroupElementBase extends HTMLElement implements HTMLEMenuItemGroupElement {
    name: string;
    label: string;
    type: "list" | "grid";
    rows: number;
    cells: number;
    parentMenu: HTMLEMenuElement | null;
    items: HTMLEMenuItemElement[];
    private _activeIndex;
    constructor();
    get activeIndex(): number;
    get activeItem(): HTMLEMenuItemElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement;
    }
}
