var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEStatusBarElementBase = void 0;
    let HTMLEStatusBarElementBase = class HTMLEStatusBarElementBase extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <style>
                :host {
                    display: flex;
                    position: relative; 
                    user-select: none;

                    background-color: white;
                }

                :host(:focus) {
                    outline: 1px solid -webkit-focus-ring-color;
                }

                :host(:focus) ::slotted(:first-child),
                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
            this.items = [];
            this._selectedItemIndex = -1;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", (event) => {
                    const items = event.target.assignedElements()
                        .filter(item => (0, HTMLElement_1.isTagElement)("e-statusitem", item));
                    this.items = items;
                }, { once: true });
            }
        }
        get selectedItemIndex() {
            return this._selectedItemIndex;
        }
        get selectedItem() {
            return this.items[this.selectedItemIndex] || null;
        }
        insertItem(index, item) {
            index = Math.min(Math.max(index, -this.items.length), this.items.length);
            this.insertBefore(item, this.children[index >= 0 ? index : this.children.length + index]);
            this.items.splice(index, 0, item);
            item.addEventListener("mouseenter", () => {
                this.selectItem(this.items.indexOf(item));
            });
            item.addEventListener("mouseleave", () => {
            });
        }
        findItem(predicate) {
            const items = this.findItems(predicate);
            if (items.length > 0) {
                return items[0];
            }
            return null;
        }
        findItems(predicate) {
            const items = [];
            this.items.forEach((item) => {
                if (predicate(item)) {
                    items.push(item);
                }
            });
            return items;
        }
        selectItem(index) {
            if (index !== this.selectedItemIndex) {
                this.clearSelection();
                let item = this.items[index];
                if (item) {
                    this._selectedItemIndex = index;
                }
            }
        }
        clearSelection() {
            let item = this.selectedItem;
            if (item) {
                this._selectedItemIndex = -1;
            }
        }
    };
    HTMLEStatusBarElementBase = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-statusbar"
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
        ])
    ], HTMLEStatusBarElementBase);
    exports.HTMLEStatusBarElementBase = HTMLEStatusBarElementBase;
});
//# sourceMappingURL=StatusBar.js.map