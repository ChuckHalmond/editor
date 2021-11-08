import { HotKey } from "../../../Input";
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuBarElement } from "./MenuBar";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuItemElement };

type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";

interface HTMLEMenuItemElementConstructor {
    readonly prototype: HTMLEMenuItemElement;
    new(): HTMLEMenuItemElement;
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

type HotKeyChangeEvent = CustomEvent<{
    oldHotKey: HotKey | null;
    newHotKey: HotKey | null;
}>;

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement,
    }

    interface HTMLElementEventMap {
        "e_hotkeychange": HotKeyChangeEvent
    }
}

@CustomElement({
    name: "e-menuitem"
})
class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {

    @AttributeProperty({type: "string"})
    public name!: string;
    
    @AttributeProperty({type: "string"})
    public label!: string;

    @AttributeProperty({type: "string"})
    public type!: EMenuItemElementType;

    @AttributeProperty({type: "boolean"})
    public disabled!: boolean;

    @AttributeProperty({type: "boolean"})
    public checked!: boolean;

    public group: HTMLEMenuItemGroupElement | null;
    public parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
    public childMenu: HTMLEMenuElement | null;

    public command: string | null;
    public commandArgs: any;

    private _hotkey: HotKey | null;

    public readonly shadowRoot!: ShadowRoot;

    public static get observedAttributes(): string[] {
        return ["label", "checked", "type"];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            position: relative;
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
                            position: absolute;
                            color: initial;
                        }
        
                        :host([type="menu"]) ::slotted([slot="menu"]) {
                            top: 100%;
                            left: 0;
                        }
                        
                        :host([type="submenu"]) ::slotted([slot="menu"]) {
                            left: 100%;
                            top: -6px;
                        }
                        
                        :host([type="submenu"]) ::slotted([slot="menu"][overflowing]) {
                            right: 100%;
                            left: auto;
                        }
                        
                        :host([type="menu"]) ::slotted([slot="menu"][overflowing]) {
                            right: 0;
                            left: auto;
                        }
        
                        :host([type="menu"]) ::slotted([slot="menu"]:not([expanded])),
                        :host([type="submenu"]) ::slotted([slot="menu"]:not([expanded])) {
                            opacity: 0;
                            pointer-events: none !important;
                        }
        
                        [part~="content"] {
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
                            margin: 2px;
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
                    `
                }
            }),
            HTML("span", {
                part: ["content"],
                children: [
                    HTML("input", {
                        part: ["input"],
                        properties: {
                            type: "button",
                            tabIndex: -1
                        }
                    }),
                    HTML("span", {
                        part: ["label"]
                    }),
                    HTML("span", {
                        part: ["hotkey"]
                    }),
                    HTML("span", {
                        part: ["arrow"]
                    })
                ]
            }),
            HTML("slot", {
                properties: {
                    name: "menu"
                }
            })
        );
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
            new CustomEvent("e_hotkeychange", {
                bubbles: true,
                detail: {
                    oldHotKey: this._hotkey,
                    newHotKey: hotkey
                }
            })
        );

        this._hotkey = hotkey;

        const hotkeyPart = this.shadowRoot?.querySelector("[part~=hotkey]");
        if (hotkeyPart) {
            hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
        }
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.setAttribute("aria-label", this.label);

        this.group = (
            this.parentElement instanceof HTMLEMenuItemGroupElement
        ) ? this.parentElement : null;

        this.parentMenu = (
            this.parentElement instanceof HTMLEMenuElement ||
            this.parentElement instanceof HTMLEMenuBarElement
        ) ? this.parentElement : null;

        this.shadowRoot.addEventListener("slotchange", this);
    }

    public handleEvent(event: Event) {
        const target = event.target;
        switch (event.type) {
            case "slotchange":
                const slottedMenu = (target as HTMLSlotElement).assignedElements()[0];
                this.childMenu = (slottedMenu instanceof HTMLEMenuElement) ? slottedMenu : null;
                break;
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
                            this.dispatchEvent(new CustomEvent("e_change", {bubbles: true}));
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

    public click(): void {
        super.click();
        if (!this.disabled) {
            switch (this.type) {
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "menu":
                    if (this.childMenu) {
                        this.childMenu.focusItemAt(0);
                    }
                    break;
            }
        }
    }
}

var HTMLEMenuItemElement: HTMLEMenuItemElementConstructor = HTMLEMenuItemElementBase;