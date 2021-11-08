import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuBarElement };
interface HTMLEMenuBarElementConstructor {
    readonly prototype: HTMLEMenuBarElement;
    new (): HTMLEMenuBarElement;
}
interface HTMLEMenuBarElement extends HTMLElement {
    name: string;
    active: boolean;
    items: HTMLEMenuItemElement[];
    readonly shadowRoot: ShadowRoot;
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement;
    }
}
declare var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor;
