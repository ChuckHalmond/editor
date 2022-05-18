import { HTMLEActionElement } from "../actions/Action";
import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuItemElement };
export { EMenuItem };
interface HTMLEMenuItemElementConstructor {
    readonly prototype: HTMLEMenuItemElement;
    new (): HTMLEMenuItemElement;
}
interface HTMLEMenuItemElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    active: boolean;
    index: number;
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
    readonly prototype: HTMLEMenuItemElement;
    new (init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    button(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    checkbox(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    radio(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    menu(init: {
        name: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    submenu(init: {
        name: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
}
declare var EMenuItem: EMenuItemConstructor;
