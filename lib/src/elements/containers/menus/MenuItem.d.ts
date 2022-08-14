import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuItemElement };
export { EMenuItem };
interface HTMLEMenuItemElementConstructor {
    prototype: HTMLEMenuItemElement;
    new (): HTMLEMenuItemElement;
}
interface HTMLEMenuItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    name: string;
    label: string | null;
    value: string;
    hotkey: string;
    disabled: boolean;
    checked: boolean;
    expanded: boolean;
    type: "button" | "checkbox" | "radio" | "menu" | "submenu";
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement;
    }
}
declare var HTMLEMenuItemElement: HTMLEMenuItemElementConstructor;
interface EMenuItemConstructor {
    prototype: HTMLEMenuItemElement;
    new (init: {
        name?: string;
        label: string;
        type?: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    button(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    checkbox(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    radio(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    menu(init: {
        name?: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    submenu(init: {
        name?: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
}
declare var EMenuItem: EMenuItemConstructor;
