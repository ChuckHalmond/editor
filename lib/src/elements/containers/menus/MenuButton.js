var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
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
                    cursor: pointer;
                    padding: 2px;
                }

                :host(:hover) {
                    background-color: gainsboro;
                }

                :host(:focus-within:not(:focus)) {
                    background-color: gainsboro;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }
                
                ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="toggle_arrow"] {
                    position: relative;
                    display: inline-block;
                    flex: auto;
                    width: 18px;
                    height: 18px;
                }

                [part~="toggle_arrow"]::after {
                    display: inline-block;
                    text-align: center;
                    width: 18px;
                    position: absolute;
                    content: "▼";
                    color: dimgray;
                }
            </style>
            <span part="toggle_arrow"></span>
            <slot name="menu"></slot>
        `);
        this.childMenu = null;
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
        this.addEventListener("click", (event) => {
            let target = event.target;
            if (this.childMenu && !this.childMenu.contains(target)) {
                this.toggle();
            }
        });
        this.addEventListener("blur", (event) => {
            let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget);
            if (!containsNewFocus) {
                this.active = false;
            }
        }, { capture: true });
    }
    toggle() {
        if (!this.active) {
            this.active = true;
            if (this.childMenu) {
                this.childMenu.focusItemAt(0);
            }
        }
        else {
            this.active = false;
        }
    }
    trigger() {
        alert();
        if (!this.disabled) {
            this.dispatchEvent(new CustomEvent("trigger", { bubbles: true }));
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var _a;
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
            }
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
        { name: "disabled", type: "boolean" },
    ])
], HTMLEMenuButtonElementBase);
//# sourceMappingURL=MenuButton.js.map