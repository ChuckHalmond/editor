var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
import { HTMLETabPanelElement } from "./TabPanel";
export { HTMLETabElement };
let HTMLETabElementBase = class HTMLETabElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    
                    user-select: none;
                    white-space: nowrap;
                    padding: 2px 6px;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                }
                
                :host([disabled]) {
                    color: grey;
                    pointer-events: none;
                }

                :host([active]) {
                    border-left: 3px solid dimgray;
                    background-color: whitesmoke;
                }

                ::slotted(*) {
                    pointer-events: none;
                }
            </style>
            <slot></slot>
        `);
        this.panel = null;
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        const panel = document.getElementById(this.controls);
        if (panel !== this.panel && panel instanceof HTMLETabPanelElement) {
            this.panel = panel;
        }
        if (this.panel) {
            this.panel.hidden = !this.active;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            switch (name) {
                case "active":
                    if (this.active) {
                        this.dispatchEvent(new CustomEvent("e_tabchange", { detail: { tab: this }, bubbles: true }));
                    }
                    const panel = document.getElementById(this.controls);
                    if (panel !== this.panel && panel instanceof HTMLETabPanelElement) {
                        this.panel = panel;
                    }
                    if (this.panel) {
                        this.panel.hidden = !this.active;
                    }
                    break;
            }
        }
    }
};
HTMLETabElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-tab",
        observedAttributes: ["active", "controls"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "active", type: "boolean" },
        { name: "disabled", type: "boolean" },
        { name: "controls", type: "string" },
    ])
], HTMLETabElementBase);
var HTMLETabElement = HTMLETabElementBase;
//# sourceMappingURL=Tab.js.map