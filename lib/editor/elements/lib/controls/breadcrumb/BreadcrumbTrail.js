var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEBreadcrumbTrailElementBase = void 0;
    let HTMLEBreadcrumbTrailElementBase = class HTMLEBreadcrumbTrailElementBase extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }
                
                [part~="ul"] {
                    display: flex;
                    flex-direction: row;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
            this.items = [];
        }
        activateItem(item) {
            let itemIndex = this.items.indexOf(item);
            if (itemIndex > -1) {
                this.items.forEach((item, index) => {
                    item.active = (index == itemIndex);
                    item.hidden = (index > itemIndex);
                });
                let activeItem = this.items[itemIndex];
                activeItem.dispatchEvent(new CustomEvent("activate"));
            }
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements().filter(item => (0, HTMLElement_1.isTagElement)("e-breadcrumbitem", item));
                    this.items = items;
                    items.forEach((item, index) => {
                        item.active = (index === items.length - 1);
                    });
                });
            }
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("e-breadcrumbitem", target)) {
                    this.activateItem(target);
                }
            });
        }
    };
    HTMLEBreadcrumbTrailElementBase = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-breadcrumbtrail"
        })
    ], HTMLEBreadcrumbTrailElementBase);
    exports.HTMLEBreadcrumbTrailElementBase = HTMLEBreadcrumbTrailElementBase;
});
//# sourceMappingURL=BreadcrumbTrail.js.map