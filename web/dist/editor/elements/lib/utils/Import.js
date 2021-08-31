var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEImportElementBase = void 0;
    let HTMLEImportElementBase = class HTMLEImportElementBase extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            const importRequest = async (src) => {
                this.outerHTML = await fetch(src).then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    else {
                        throw new Error(response.statusText);
                    }
                });
                this.dispatchEvent(new CustomEvent("e-load"));
            };
            if (this.src) {
                importRequest(this.src);
            }
        }
    };
    HTMLEImportElementBase = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-import"
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "src", type: "string" }
        ])
    ], HTMLEImportElementBase);
    exports.HTMLEImportElementBase = HTMLEImportElementBase;
});
//# sourceMappingURL=Import.js.map