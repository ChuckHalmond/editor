var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, element } from "../../Element";
import "./TreeItem";
export { HTMLETreeItemGroupElement };
var shadowTemplate;
var style;
let HTMLETreeItemGroupElementBase = class HTMLETreeItemGroupElementBase extends HTMLElement {
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("slot"));
        style = /*css*/ `
            :host {
                display: block;
            }
        `;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
};
HTMLETreeItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-treeitemgroup"
    })
], HTMLETreeItemGroupElementBase);
var HTMLETreeItemGroupElement = HTMLETreeItemGroupElementBase;
//# sourceMappingURL=TreeItemGroup.js.map