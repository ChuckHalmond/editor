import { HTMLEStatusItemElement } from "./StatusItem";
export { HTMLEStatusBarElement };
export { HTMLEStatusBarElementBase };
interface HTMLEStatusBarElement extends HTMLElement {
    items: HTMLEStatusItemElement[];
}
declare class HTMLEStatusBarElementBase extends HTMLElement implements HTMLEStatusBarElement {
    name: string;
    active: boolean;
    items: HTMLEStatusItemElement[];
    _selectedItemIndex: number;
    constructor();
    connectedCallback(): void;
    get selectedItemIndex(): number;
    get selectedItem(): HTMLEStatusItemElement | null;
    insertItem(index: number, item: HTMLEStatusItemElement): void;
    findItem(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement | null;
    findItems(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement[];
    selectItem(index: number): void;
    clearSelection(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-statusbar": HTMLEStatusBarElement;
    }
}
