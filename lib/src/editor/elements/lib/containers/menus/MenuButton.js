var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "src/editor/elements/HTMLElement";
export { HTMLEMenuButtonElementBase };
let HTMLEMenuButtonElementBase = class HTMLEMenuButtonElementBase extends HTMLElement {
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

                :host(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                /*:host(:focus) {
                    outline: none;
                }*/

                :host(:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                :host ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                :host ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }
                
                :host ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                :host ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                }

                [part~="icon"] {
                    display: none;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                    pointer-events: none;
                }

                [part~="input"] {
                    display: inline-block;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin: auto;
                    pointer-events: none;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="icon"></span>
                    <span part="label"></span>
                    <span part="description"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
        this.childMenu = null;
        this.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Enter":
                    if (!this.active) {
                        this.active = true;
                        if (this.childMenu) {
                            this.childMenu.focusItemAt(0);
                        }
                    }
                    break;
                case "Escape":
                    this.focus();
                    this.active = false;
                    break;
            }
        });
        this.addEventListener("click", () => {
            this.trigger();
        });
        this.addEventListener("blur", (event) => {
            let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget);
            if (!containsNewFocus) {
                this.active = false;
            }
        }, { capture: true });
    }
    trigger() {
        if (!this.active) {
            this.active = true;
            if (this.childMenu) {
                this.childMenu.focus();
            }
        }
        else {
            this.active = false;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var _a, _b;
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
                case "icon":
                    if (oldValue !== newValue) {
                        const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                        if (iconPart) {
                            iconPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }
    connectedCallback() {
        var _a;
        this.tabIndex = this.tabIndex;
        const menuSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=menu]");
        if (menuSlot) {
            menuSlot.addEventListener("slotchange", () => {
                const menuElem = menuSlot.assignedElements()[0];
                if (isTagElement("e-menu", menuElem)) {
                    this.childMenu = menuElem;
                }
            });
        }
    }
};
HTMLEMenuButtonElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menubutton",
        observedAttributes: ["icon", "label", "checked"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "active", type: "boolean" },
        { name: "label", type: "string" },
        { name: "icon", type: "string" },
        { name: "disabled", type: "boolean" },
    ])
], HTMLEMenuButtonElementBase);
//# sourceMappingURL=MenuButton.js.map