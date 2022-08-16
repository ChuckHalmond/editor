import { HTMLESelectElement } from "../../controls/forms/Select";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";
export { HTMLEToolBarItemElement };
export { EToolBarItem };
interface HTMLEToolBarItemElementConstructor {
    prototype: HTMLEToolBarItemElement;
    new (): HTMLEToolBarItemElement;
}
interface HTMLEToolBarItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    readonly select: HTMLESelectElement | null;
    value: string;
    name: string;
    label: string;
    active: boolean;
    pressed: boolean;
    expanded: boolean;
    type: "button" | "checkbox" | "radio" | "menubutton" | "select";
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritem": HTMLEToolBarItemElement;
    }
}
declare var HTMLEToolBarItemElement: HTMLEToolBarItemElementConstructor;
interface EToolBarItemConstructor {
    prototype: HTMLEToolBarItemElement;
    new (init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menubutton" | "select";
        value?: string;
        trigger?: () => void;
        menubutton?: HTMLEMenuButtonElement;
        select?: HTMLESelectElement;
    }): HTMLEToolBarItemElement;
    button(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    checkbox(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    radio(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    menubutton(init: {
        name: string;
        label: string;
        menubutton: HTMLEMenuButtonElement;
    }): HTMLEToolBarItemElement;
    select(init: {
        name: string;
        label: string;
        select: HTMLESelectElement;
    }): HTMLEToolBarItemElement;
}
declare var EToolBarItem: EToolBarItemConstructor;
