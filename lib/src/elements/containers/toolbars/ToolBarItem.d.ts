import { HTMLESelectElement } from "../../controls/forms/Select";
import { HTMLEActionElement } from "../actions/Action";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";
export { HTMLEToolBarItemElement };
export { EToolBarItem };
interface HTMLEToolBarItemElementConstructor {
    readonly prototype: HTMLEToolBarItemElement;
    new (): HTMLEToolBarItemElement;
}
interface HTMLEToolBarItemElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly menubutton: HTMLEMenuButtonElement | null;
    readonly select: HTMLESelectElement | null;
    name: string;
    label: string;
    active: boolean;
    type: "button" | "checkbox" | "radio" | "menubutton" | "select";
}
declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritem": HTMLEToolBarItemElement;
    }
}
declare var HTMLEToolBarItemElement: HTMLEToolBarItemElementConstructor;
interface EToolBarItemConstructor {
    readonly prototype: HTMLEToolBarItemElement;
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
