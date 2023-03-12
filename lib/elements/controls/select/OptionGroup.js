var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, element } from "../../Element";
export { HTMLEOptionGroupElement };
var shadowTemplate;
var style;
let HTMLEOptionGroupElementBase = class HTMLEOptionGroupElementBase extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                display: block;
            }
        `;
})();
HTMLEOptionGroupElementBase = __decorate([
    CustomElement({
        name: "e-optiongroup"
    })
], HTMLEOptionGroupElementBase);
var HTMLEOptionGroupElement = HTMLEOptionGroupElementBase;
//# sourceMappingURL=OptionGroup.js.map