var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bindShadowRoot, GenerateAttributeAccessors, RegisterCustomHTMLElement } from "src/editor/elements/HTMLElement";
export { isHTMLETabPanelElement };
export { BaseHTMLETabPanelElement };
function isHTMLETabPanelElement(obj) {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-tabpanel";
}
let BaseHTMLETabPanelElement = class BaseHTMLETabPanelElement extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([hidden]) {
                    display: none;
                }
            </style>
            <slot></slot>
        `);
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
};
BaseHTMLETabPanelElement = __decorate([
    RegisterCustomHTMLElement({
        name: "e-tabpanel"
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" }
    ])
], BaseHTMLETabPanelElement);
//# sourceMappingURL=TabPanel.js.map