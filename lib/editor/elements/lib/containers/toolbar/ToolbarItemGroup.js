var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupElement = exports.isHTMLEMenuItemGroupElement = void 0;
    function isHTMLEMenuItemGroupElement(elem) {
        return elem.tagName.toLowerCase() === "e-menuitemgroup";
    }
    exports.isHTMLEMenuItemGroupElement = isHTMLEMenuItemGroupElement;
    let HTMLEMenuItemGroupElement = class HTMLEMenuItemGroupElement extends HTMLElement {
    };
    HTMLEMenuItemGroupElement = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-menuitemgroup",
            observedAttributes: ["label", "active"]
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "active", type: "boolean" },
            { name: "label", type: "string" },
            { name: "type", type: "string" },
            { name: "name", type: "string" },
            { name: "rows", type: "number" },
            { name: "cells", type: "number" },
        ])
    ], HTMLEMenuItemGroupElement);
    exports.HTMLEMenuItemGroupElement = HTMLEMenuItemGroupElement;
});
//# sourceMappingURL=ToolbarItemGroup.js.map