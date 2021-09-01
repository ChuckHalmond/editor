var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLETreeViewListElementBase = void 0;
    let HTMLETreeViewListElementBase = class HTMLETreeViewListElementBase extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    margin: 0;
                }
            </style>
            <ul part="container">
                <slot></slot>
            </ul>
        `);
            this.items = [];
            this._activeItem = null;
        }
        get activeItem() {
            return this._activeItem;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements()
                        .filter(item => (0, HTMLElement_1.isTagElement)("e-treeviewitem", item));
                    this.items = items;
                    items.forEach((item) => {
                        item.parent = this;
                        item.indent = 1;
                    });
                });
            }
            this.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowLeft":
                        if (this.activeItem) {
                            if (this.activeItem.expanded) {
                                this.activeItem.toggle();
                            }
                            else {
                                if ((0, HTMLElement_1.isTagElement)("e-treeviewitem", this.activeItem.parent)) {
                                    this.activeItem.parent.focus();
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case "ArrowRight":
                        if (this.activeItem) {
                            if (!this.activeItem.expanded) {
                                this.activeItem.toggle();
                            }
                            else {
                                if (this.activeItem.items.length > 0) {
                                    this.activeItem.items[0].focus();
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case "ArrowUp":
                        if (this.activeItem) {
                            this.activeItem.previousVisibleItem().focus();
                        }
                        else if (this.items.length > 0) {
                            this.items[0].focus();
                        }
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                        if (this.activeItem) {
                            this.activeItem.nextVisibleItem().focus();
                        }
                        else if (this.items.length > 0) {
                            this.items[this.items.length - 1].focus();
                        }
                        event.preventDefault();
                        break;
                    case "Home":
                        if (this.items.length > 0) {
                            this.items[0].focus({ preventScroll: true });
                        }
                        event.preventDefault();
                        break;
                    case "End":
                        if (this.items.length > 0) {
                            this.items[this.items.length - 1].deepestVisibleChildItem().focus();
                        }
                        event.preventDefault();
                        break;
                    case "Enter":
                        if (this.activeItem) {
                            this.activeItem.trigger();
                        }
                        break;
                    case "Escape":
                        this.active = false;
                        if (this.activeItem) {
                            this.activeItem.active = false;
                        }
                        this.focus();
                        break;
                }
            });
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("e-treeviewitem", target)) {
                    target.trigger();
                }
            });
            this.addEventListener("focusin", (event) => {
                let target = event.target;
                if (!this.active) {
                    this.active = true;
                }
                if ((0, HTMLElement_1.isTagElement)("e-treeviewitem", target)) {
                    if (this._activeItem) {
                        this._activeItem.active = false;
                    }
                    this._activeItem = target;
                    this._activeItem.active = true;
                }
            });
            this.addEventListener("focusout", (event) => {
                let relatedTarget = event.relatedTarget;
                if (!this.contains(relatedTarget)) {
                    this.active = false;
                }
            });
        }
    };
    HTMLETreeViewListElementBase = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-treeviewlist"
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "active", type: "boolean" },
            { name: "name", type: "string" }
        ])
    ], HTMLETreeViewListElementBase);
    exports.HTMLETreeViewListElementBase = HTMLETreeViewListElementBase;
});
//# sourceMappingURL=TreeViewList.js.map