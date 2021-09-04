var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
export { HTMLEMenuItemElementBase };
let HTMLEMenuItemElementBase = class HTMLEMenuItemElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
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
                    color: lightgray;
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

                [part~="li"] {
                    display: flex;
                    list-style-type: none;
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
                    position: absolute;
                    content: "›";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    transform: scale(1.2) translateY(-15%);
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
                    display: none;
                }
                
                :host(:not([type="submenu"])) [part~="arrow"] {
                    visibility: hidden;
                }
            </style>
            <li part="li">
                <span part="content">
                    <input part="input" type="button" tabindex="-1"></input>
                    <span part="label"></span>
                    <span part="hotkey"></span>
                    <span part="description"></span>
                    <span part="arrow"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
        this.childMenu = null;
        this.parentMenu = null;
        this.group = null;
        this.command = null;
        this._hotkey = null;
    }
    get hotkey() {
        return this._hotkey;
    }
    set hotkey(hotkey) {
        var _a;
        this.dispatchEvent(new CustomEvent("e-hotkeychange", {
            bubbles: true,
            detail: {
                oldHotKey: this._hotkey,
                newHotKey: hotkey
            }
        }));
        this._hotkey = hotkey;
        let hotkeyPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=hotkey]");
        if (hotkeyPart) {
            hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
        }
    }
    connectedCallback() {
        var _a;
        this.tabIndex = this.tabIndex;
        this.setAttribute("aria-label", this.label);
        const menuSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=menu]");
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
    attributeChangedCallback(name, oldValue, newValue) {
        var _a, _b, _c;
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
                case "checked":
                    if (oldValue !== newValue) {
                        const inputPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=input]");
                        if (inputPart) {
                            inputPart.checked = (newValue !== null);
                            this.dispatchEvent(new CustomEvent("e-change", { bubbles: true }));
                        }
                    }
                    break;
                case "type":
                    if (oldValue !== newValue) {
                        const inputPart = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector("[part~=input]");
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
    trigger() {
        if (!this.disabled) {
            switch (this.type) {
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "radio":
                    this.dispatchEvent(new CustomEvent("radiochangerequest", { bubbles: true }));
                    break;
                case "menu":
                    if (this.childMenu) {
                        this.childMenu.focusItemAt(0);
                    }
                    break;
            }
            this.dispatchEvent(new CustomEvent("trigger", { bubbles: true }));
        }
    }
};
HTMLEMenuItemElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menuitem",
        observedAttributes: ["label", "checked", "type"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "label", type: "string" },
        { name: "type", type: "string" },
        { name: "disabled", type: "boolean" },
        { name: "checked", type: "boolean" },
    ])
], HTMLEMenuItemElementBase);
//# sourceMappingURL=MenuItem.js.map