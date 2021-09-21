import { HotKey } from "../../../Input";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuBarElement } from "./MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
export { EMenuItemElementType };
export { HTMLEMenuItemElement };
export { HTMLEMenuItemElementBase };
export { HotKeyChangeEvent };
declare type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";
interface HTMLEMenuItemElement extends HTMLElement {
    name: string;
    label: string;
    type: EMenuItemElementType;
    disabled: boolean;
    checked: boolean;
    value: string;
    group: HTMLEMenuItemGroupElement | null;
    parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    childMenu: HTMLEMenuElement | null;
    hotkey: HotKey | null;
    command: string | null;
    commandArgs: any;
    trigger(): void;
}
declare class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {
    name: string;
    label: string;
    type: EMenuItemElementType;
    disabled: boolean;
    checked: boolean;
    value: string;
    group: HTMLEMenuItemGroupElement | null;
    parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    childMenu: HTMLEMenuElement | null;
    command: string | null;
    commandArgs: any;
    private _hotkey;
    constructor();
    get hotkey(): HotKey | null;
    set hotkey(hotkey: HotKey | null);
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    trigger(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement;
    }
}
declare type HotKeyChangeEvent = CustomEvent<{
    oldHotKey: HotKey | null;
    newHotKey: HotKey | null;
}>;
declare global {
    interface HTMLElementEventMap {
        "e_hotkeychange": HotKeyChangeEvent;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_trigger": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_radiochangerequest": Event;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_change": Event;
    }
}
