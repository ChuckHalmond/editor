var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors } from "src/editor/elements/HTMLElement";
export { HTMLEMenuItemElement };
export { isHTMLEMenuItemElement };
function isHTMLEMenuItemElement(elem) {
    return elem.tagName.toLowerCase() === "e-menuitem";
}
let HTMLEMenuItemElement = class HTMLEMenuItemElement extends HTMLElement {
};
HTMLEMenuItemElement = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menuitem",
        observedAttributes: ["icon", "label", "checked"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "label", type: "string" },
        { name: "icon", type: "string" },
        { name: "type", type: "string" },
        { name: "disabled", type: "boolean" },
        { name: "checked", type: "boolean" },
        { name: "value", type: "string" },
    ])
], HTMLEMenuItemElement);
//# sourceMappingURL=ToolbarItem.js.map