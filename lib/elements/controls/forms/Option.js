var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, element } from "../../Element";
export { HTMLEOptionElement };
var shadowTemplate;
var style;
let HTMLEOptionElementBase = class HTMLEOptionElementBase extends HTMLElement {
    constructor() {
        super();
        const internals = this.attachInternals();
        internals.role = "option";
        this.internals = internals;
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "label": {
                const { shadowRoot } = this;
                const labelPart = shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "selected": {
                const { internals, selected } = this;
                internals.ariaSelected = String(selected);
                this.dispatchEvent(new Event("select", { bubbles: true }));
                break;
            }
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("span", {
        attributes: {
            part: "label"
        }
    }));
    style = /*css*/ `
            :host {
                display: flex;
                user-select: none;
                white-space: nowrap;
                line-height: 22px;
                padding: 0 12px;
            }
            
            :host(:hover) {
                background-color: var(--hovered-item-color);
            }
            
            :host(:focus-within) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
            
            :host([selected]) {
                background-color: var(--selected-item-color);
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(::before) {
                display: flex;
                content: "";
                width: 18px;
                height: 18px;
                margin-right: 6px;
            
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                background-color: var(--icon-color, none);
                -webkit-mask-image: var(--icon-image, none);
                mask-image: var(--icon-image, none);
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEOptionElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEOptionElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEOptionElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEOptionElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEOptionElementBase.prototype, "selected", void 0);
HTMLEOptionElementBase = __decorate([
    CustomElement({
        name: "e-option"
    })
], HTMLEOptionElementBase);
var HTMLEOptionElement = HTMLEOptionElementBase;
//# sourceMappingURL=Option.js.map