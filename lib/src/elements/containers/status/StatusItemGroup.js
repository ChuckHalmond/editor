var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { element, CustomElement, AttributeProperty } from "../../Element";
export { HTMLEStatusItemGroupElement };
var shadowTemplate;
var style;
let HTMLEStatusItemGroupElementBase = class HTMLEStatusItemGroupElementBase extends HTMLElement {
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
], HTMLEStatusItemGroupElementBase.prototype, "name", void 0);
HTMLEStatusItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-statusitemgroup"
    })
], HTMLEStatusItemGroupElementBase);
var HTMLEStatusItemGroupElement = HTMLEStatusItemGroupElementBase;
//# sourceMappingURL=StatusItemGroup.js.map