var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "editor/elements/HTMLElement";
export { HTMLEBreadcrumbTrailElementBase };
let HTMLEBreadcrumbTrailElementBase = class HTMLEBreadcrumbTrailElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
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
                const items = slot.assignedElements().filter(item => isTagElement("e-breadcrumbitem", item));
                this.items = items;
                items.forEach((item, index) => {
                    item.active = (index === items.length - 1);
                });
            });
        }
        this.addEventListener("mousedown", (event) => {
            let target = event.target;
            if (isTagElement("e-breadcrumbitem", target)) {
                this.activateItem(target);
            }
        });
    }
};
HTMLEBreadcrumbTrailElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-breadcrumbtrail"
    })
], HTMLEBreadcrumbTrailElementBase);
//# sourceMappingURL=BreadcrumbTrail.js.map