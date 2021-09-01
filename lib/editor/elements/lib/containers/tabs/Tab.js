var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement", "src/editor/elements/lib/containers/tabs/TabPanel"], function (require, exports, HTMLElement_1, TabPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabElement = void 0;
    let BaseHTMLETabElement = class BaseHTMLETabElement extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    user-select: none;
                    white-space: nowrap;
                    padding: 6px;
                    border-left: 4px solid transparent;
                    cursor: pointer;
                }
                
                :host([disabled]) {
                    color: grey;
                    pointer-events: none;
                }

                :host([active]) {
                    border-left: 4px solid black;
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
            let panel = document.getElementById(this.controls);
            if ((0, HTMLElement_1.isTagElement)("e-tabpanel", panel)) {
                this.panel = panel;
                this.panel.hidden = !this.active;
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "controls":
                    if (oldValue !== newValue) {
                        let panel = document.getElementById(this.controls);
                        if ((0, TabPanel_1.isHTMLETabPanelElement)(panel)) {
                            this.panel = panel;
                        }
                    }
                    break;
                case "active":
                    if (this.active) {
                        this.dispatchEvent(new CustomEvent("tabchange", { detail: { tab: this }, bubbles: true }));
                    }
                    if (this.panel) {
                        this.panel.hidden = !this.active;
                    }
                    break;
            }
        }
    };
    BaseHTMLETabElement = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-tab",
            observedAttributes: ["active", "controls"]
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
            { name: "disabled", type: "boolean" },
            { name: "controls", type: "string" },
        ])
    ], BaseHTMLETabElement);
    exports.BaseHTMLETabElement = BaseHTMLETabElement;
});
//# sourceMappingURL=Tab.js.map