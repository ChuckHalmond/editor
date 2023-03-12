var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { element, CustomElement, AttributeProperty } from "../../Element";
import "./ToolBarItem";
export { HTMLEToolBarItemGroupElement };
var shadowTemplate;
var style;
let HTMLEToolBarItemGroupElementBase = class HTMLEToolBarItemGroupElementBase extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "label": {
                const label = this.shadowRoot.querySelector("[part='label']");
                if (label) {
                    label.textContent = newValue;
                }
                break;
            }
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                display: flex;
                width: max-content;
                flex-direction: row;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemGroupElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemGroupElementBase.prototype, "label", void 0);
HTMLEToolBarItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-toolbaritemgroup"
    })
], HTMLEToolBarItemGroupElementBase);
var HTMLEToolBarItemGroupElement = HTMLEToolBarItemGroupElementBase;
//# sourceMappingURL=ToolBarItemGroup.js.map