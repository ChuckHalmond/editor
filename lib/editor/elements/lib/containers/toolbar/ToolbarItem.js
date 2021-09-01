var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEMenuItemElement = exports.HTMLEMenuItemElement = void 0;
    function isHTMLEMenuItemElement(elem) {
        return elem.tagName.toLowerCase() === "e-menuitem";
    }
    exports.isHTMLEMenuItemElement = isHTMLEMenuItemElement;
    let HTMLEMenuItemElement = class HTMLEMenuItemElement extends HTMLElement {
    };
    HTMLEMenuItemElement = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-menuitem",
            observedAttributes: ["icon", "label", "checked"]
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "name", type: "string" },
            { name: "label", type: "string" },
            { name: "icon", type: "string" },
            { name: "type", type: "string" },
            { name: "disabled", type: "boolean" },
            { name: "checked", type: "boolean" },
            { name: "value", type: "string" },
        ])
    ], HTMLEMenuItemElement);
    exports.HTMLEMenuItemElement = HTMLEMenuItemElement;
});
//# sourceMappingURL=ToolbarItem.js.map