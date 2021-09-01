import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuBarElement };
export { HTMLEMenuBarElementBase };
interface HTMLEMenuBarElement extends HTMLElement {
    name: string;
    active: boolean;
    items: HTMLEMenuItemElement[];
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
}
declare class HTMLEMenuBarElementBase extends HTMLElement implements HTMLEMenuBarElement {
    name: string;
    active: boolean;
    items: HTMLEMenuItemElement[];
    private _activeIndex;
    constructor();
    get activeIndex(): number;
    get activeItem(): HTMLEMenuItemElement | null;
    connectedCallback(): void;
    focusItemAt(index: number, childMenu?: boolean): void;
    focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement;
    }
}
