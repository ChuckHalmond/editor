var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement } from "../Element";
export { HTMLESeparatorElement };
var style;
let HTMLESeparatorElementBase = class HTMLESeparatorElementBase extends HTMLElement {
    #internals;
    static {
        style = /*css*/ `
            :host {
                display: block;
                margin: 10px 0 10px 27px;
                border: none;
                border-top: 1px solid lightgrey;
            }
        `;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.#internals = this.attachInternals();
        this.#internals.role = "separator";
    }
};
HTMLESeparatorElementBase = __decorate([
    CustomElement({
        name: "e-separator"
    })
], HTMLESeparatorElementBase);
var HTMLESeparatorElement = HTMLESeparatorElementBase;
//# sourceMappingURL=Separator.js.map