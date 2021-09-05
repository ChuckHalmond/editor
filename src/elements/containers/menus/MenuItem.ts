import { HotKey } from "../../../Input";
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuBarElement } from "./MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";


export { EMenuItemElementType };
export { HTMLEMenuItemElement };
export { HTMLEMenuItemElementBase };
export { HotKeyChangeEvent };

type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";

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

@RegisterCustomHTMLElement({
    name: "e-menuitem",
    observedAttributes: ["label", "checked", "type"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "label", type: "string"},
    {name: "type", type: "string"},
    {name: "disabled", type: "boolean"},
    {name: "checked", type: "boolean"},
])
class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {

    public name!: string;
    public label!: string;
    public type!: EMenuItemElementType;
    public disabled!: boolean;
    public checked!: boolean;
    public value!: string;

    public group: HTMLEMenuItemGroupElement | null;
    public parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    public childMenu: HTMLEMenuElement | null;

    public command: string | null;
    public commandArgs: any;

    private _hotkey: HotKey | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    cursor: pointer;
                }

                :host(:not([type="menu"])) {
                    padding-left: 12px;
                    padding-right: 12px;
                }

                :host(:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([disabled]) {
                    color: dimgray;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]),
                :host([type="menu"]) ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: fixed;
                    color: initial;
                }

                :host([type="menu"]) ::slotted([slot="menu"]:not([expanded])),
                :host([type="submenu"]) ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: row; 
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                    overflow: hidden;
                    pointer-events: none;
                }

                [part~="input"] {
                    display: inline-block;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin: auto 1px;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }

                [part~="hotkey"] {
                    flex: none;
                    text-align: right;
                    margin-left: 16px;
                }

                [part~="hotkey"]:empty {
                    display: none !important;
                }

                [part~="arrow"] {
                    display: inline-block;
                    flex: none;
                    margin: auto;
                    color: inherit;
                    text-align: center;
                    font-weight: bold;
                    width: 18px;
                    height: 18px;
                }

                [part~="arrow"]::after {
                    display: inline-block;
                    text-align: center;
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    content: "►";
                    color: dimgray;
                }

                :host([type="menu"]) [part~="arrow"],
                :host([type="menu"]) [part~="input"] {
                    display: none;
                }

                :host(:not([type="menu"])) [part~="label"] {
                    padding-left: 10px;
                    padding-right: 12px;
                }
                
                :host(:not([type="checkbox"]):not([type="radio"])) [part~="input"] {
                    visibility: hidden;
                    pointer-events: none;
                }
                
                :host(:not([type="submenu"])) [part~="arrow"] {
                    visibility: hidden;
                    pointer-events: none;
                }
            </style>
            <div part="container">
                <span part="content">
                    <input part="input" type="button" tabindex="-1"></input>
                    <span part="label"></span>
                    <span part="hotkey"></span>
                    <span part="arrow"></span>
                </span>
                <slot name="menu"></slot>
            </div>
        `);
        this.childMenu = null;
        this.parentMenu = null;
        this.group = null;
        this.command = null;
        this._hotkey = null;
    }

    public get hotkey(): HotKey | null {
        return this._hotkey;
    }

    public set hotkey(hotkey: HotKey | null) {
        this.dispatchEvent(
            new CustomEvent("e-hotkeychange", {
                bubbles: true,
                detail: {
                    oldHotKey: this._hotkey,
                    newHotKey: hotkey
                }
            })
        );

        this._hotkey = hotkey;

        let hotkeyPart = this.shadowRoot?.querySelector("[part~=hotkey]");
        if (hotkeyPart) {
            hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
        }
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.setAttribute("aria-label", this.label);

        const menuSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=menu]");
        if (menuSlot) {
            menuSlot.addEventListener("slotchange", () => {
                const menuElem = menuSlot.assignedElements()[0];
                if (isTagElement("e-menu", menuElem)) {
                    this.childMenu = menuElem;
                    menuElem.parentItem = this;
                }
            });
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
                case "checked":
                    if (oldValue !== newValue) {
                        const inputPart = this.shadowRoot?.querySelector<HTMLInputElement>("[part~=input]");
                        if (inputPart) {
                            inputPart.checked = (newValue !== null);
                            this.dispatchEvent(new CustomEvent("e-change", {bubbles: true}));
                        }
                    }
                    break;
                case "type":
                    if (oldValue !== newValue) {
                        const inputPart = this.shadowRoot?.querySelector<HTMLInputElement>("[part~=input]");
                        if (inputPart) {
                            switch (this.type) {
                                case "radio":
                                    inputPart.type = "radio";
                                    break;
                                case "menu":
                                    inputPart.type = "hidden";
                                    break;
                                default:
                                    inputPart.type = "checkbox";
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    }

    public trigger(): void {
        if (!this.disabled) {
            switch (this.type) {
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "radio":
                    this.dispatchEvent(new CustomEvent("radiochangerequest", {bubbles: true}));
                    break;
                case "menu":
                    if (this.childMenu) {
                        this.childMenu.focusItemAt(0);
                    }
                    break;
            }
            this.dispatchEvent(new CustomEvent("trigger", {bubbles: true}));
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement,
    }
}

type HotKeyChangeEvent = CustomEvent<{
    oldHotKey: HotKey | null;
    newHotKey: HotKey | null;
}>;

declare global {
    interface HTMLElementEventMap {
        "hotkeychange": HotKeyChangeEvent,
    }
}

declare global {
    interface HTMLElementEventMap {
        "trigger": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "radiochangerequest": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "change": Event,
    }
}