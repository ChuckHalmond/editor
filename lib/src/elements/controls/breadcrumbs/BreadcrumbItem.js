var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
export { HTMLEBreadcrumbItemElementBase };
let HTMLEBreadcrumbItemElementBase = class HTMLEBreadcrumbItemElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    cursor: pointer;
                }

                :host([active]) {
                    font-weight: bold;
                }

                :host([active]) [part~="container"]::after {
                    display: none;
                }

                [part~="container"]::after {
                    content: "►";
                }

                :host([hidden]) {
                    display: none;
                }

                [part~="container"] {
                    display: flex;
                }
            </style>
            <div part="container">
                <span part="label"></span>
                <slot></slot>
            </div>
        `);
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
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
HTMLEBreadcrumbItemElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-breadcrumbitem",
        observedAttributes: ["label"]
    }),
    GenerateAttributeAccessors([
        { name: "label", type: "string" },
        { name: "active", type: "boolean" }
    ])
], HTMLEBreadcrumbItemElementBase);
//# sourceMappingURL=BreadcrumbItem.js.map