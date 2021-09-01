var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors } from "src/editor/elements/HTMLElement";
export { HTMLEMenuBarElement };
export { isHTMLEMenuBarElement };
function isHTMLEMenuBarElement(elem) {
    return elem.tagName.toLowerCase() === "e-menubar";
}
let HTMLEMenuBarElement = class HTMLEMenuBarElement extends HTMLElement {
};
HTMLEMenuBarElement = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menubar",
        observedAttributes: ["active"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "active", type: "boolean" },
    ])
], HTMLEMenuBarElement);
//# sourceMappingURL=Toolbar.js.map