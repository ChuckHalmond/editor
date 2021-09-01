var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors } from "src/editor/elements/HTMLElement";
export { isHTMLEMenuItemGroupElement };
export { HTMLEMenuItemGroupElement };
function isHTMLEMenuItemGroupElement(elem) {
    return elem.tagName.toLowerCase() === "e-menuitemgroup";
}
let HTMLEMenuItemGroupElement = class HTMLEMenuItemGroupElement extends HTMLElement {
};
HTMLEMenuItemGroupElement = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menuitemgroup",
        observedAttributes: ["label", "active"]
    }),
    GenerateAttributeAccessors([
        { name: "active", type: "boolean" },
        { name: "label", type: "string" },
        { name: "type", type: "string" },
        { name: "name", type: "string" },
        { name: "rows", type: "number" },
        { name: "cells", type: "number" },
    ])
], HTMLEMenuItemGroupElement);
//# sourceMappingURL=ToolbarItemGroup.js.map