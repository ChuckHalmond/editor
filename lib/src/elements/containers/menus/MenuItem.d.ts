import { HotKey } from "../../../Input";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuBarElement } from "./MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
export { HTMLEMenuItemElement };
declare type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";
interface HTMLEMenuItemElementConstructor {
    readonly prototype: HTMLEMenuItemElement;
    new (): HTMLEMenuItemElement;
    readonly observedAttributes: string[];
}
interface HTMLEMenuItemElement extends HTMLElement {
    name: string;
    label: string;
    type: EMenuItemElementType;
    disabled: boolean;
    checked: boolean;
    group: HTMLEMenuItemGroupElement | null;
    parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    childMenu: HTMLEMenuElement | null;
    hotkey: HotKey | null;
    command: string | null;
    commandArgs: any;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare type HotKeyChangeEvent = CustomEvent<{
    oldHotKey: HotKey | null;
    newHotKey: HotKey | null;
}>;
declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement;
    }
    interface HTMLElementEventMap {
        "e_hotkeychange": HotKeyChangeEvent;
    }
}
declare var HTMLEMenuItemElement: HTMLEMenuItemElementConstructor;
