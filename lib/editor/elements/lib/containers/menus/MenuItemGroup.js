var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement", "src/editor/elements/Snippets"], function (require, exports, HTMLElement_1, Snippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupElementBase = void 0;
    let HTMLEMenuItemGroupElementBase = class HTMLEMenuItemGroupElementBase extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    user-select: none;
                }

                :host(:focus) {
                    outline: none;
                }
                
                :host(:not([label])) [part~="li"] {
                    display: none;
                }

                [part~="label"] {
                    position: relative;
                    display: inline-block;
                    width: 100%;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px 6px 6px;
                    font-weight: bold;
                }

                [part~="li"] {
                    list-style-type: none;
                }

                [part~="separator"] {
                    margin: 6px 0;
                }

                :host(:first-child) [part~="separator"] {
                    display: none;
                }
            </style>
            <hr part="separator"/>
            <li part="li">
                <span part="label"></span>
            </li>
            <slot></slot>
        `);
            this._activeIndex = -1;
            this.parentMenu = null;
            this.items = [];
        }
        get activeIndex() {
            return this._activeIndex;
        }
        get activeItem() {
            return this.items[this.activeIndex] || null;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements()
                        .filter(item => (0, HTMLElement_1.isTagElement)("e-menuitem", item));
                    this.items = items;
                    items.forEach((item) => {
                        item.group = this;
                    });
                });
            }
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (this.items.includes(target)) {
                    target.trigger();
                }
            });
            this.addEventListener("mouseover", (event) => {
                let target = event.target;
                let targetIndex = this.items.indexOf(target);
                if (this === target) {
                    this.reset();
                    this.focus();
                }
                else if (targetIndex >= 0) {
                    this.focusItemAt(this.items.indexOf(target), true);
                }
            });
            this.addEventListener("mouseout", (event) => {
                let target = event.target;
                let thisIntersectsWithMouse = (0, Snippets_1.pointIntersectsWithDOMRect)(event.clientX, event.clientY, this.getBoundingClientRect());
                if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                    this.reset();
                    this.focus();
                }
            });
            this.addEventListener("focusin", (event) => {
                let target = event.target;
                this._activeIndex = this.items.findIndex((item) => item.contains(target));
            });
            this.addEventListener("focusout", (event) => {
                let newTarget = event.relatedTarget;
                if (!this.contains(newTarget)) {
                    this.reset();
                }
            });
            this.addEventListener("radiochangerequest", (event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("e-menuitem", target)) {
                    let item = target;
                    if (item.type === "radio" && !item.checked) {
                        let checkedRadio = this.findItem((item) => {
                            return item.type === "radio" && item.checked;
                        });
                        if (checkedRadio) {
                            checkedRadio.checked = false;
                        }
                        item.checked = true;
                    }
                }
            });
            this.addEventListener("keydown", (event) => {
                var _a;
                switch (event.key) {
                    case "ArrowUp":
                        if (this.activeIndex > 0) {
                            this.focusItemAt(this.activeIndex - 1);
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowDown":
                        if (this.activeIndex < this.items.length - 1) {
                            this.focusItemAt(this.activeIndex + 1);
                            event.stopPropagation();
                        }
                        break;
                    case "Enter":
                        if (this.activeItem) {
                            this.activeItem.trigger();
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowRight":
                        if (this.items.includes(event.target)) {
                            if ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.childMenu) {
                                this.activeItem.childMenu.focusItemAt(0);
                                event.stopPropagation();
                            }
                        }
                        break;
                    case "Home":
                        this.focusItemAt(0);
                        break;
                    case "End":
                        this.focusItemAt(this.items.length - 1);
                        break;
                    case "Escape":
                        this.reset();
                        break;
                }
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a;
            if (oldValue !== newValue) {
                switch (name) {
                    case "label":
                        if (oldValue !== newValue) {
                            const label = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                            if (label) {
                                label.textContent = newValue;
                            }
                        }
                }
            }
        }
        focusItemAt(index, childMenu) {
            let item = this.items[index];
            if (item) {
                this._activeIndex = index;
                item.focus();
                if (childMenu && item.childMenu) {
                    item.childMenu.focus();
                }
            }
        }
        reset() {
            let item = this.activeItem;
            this._activeIndex = -1;
            if (item === null || item === void 0 ? void 0 : item.childMenu) {
                item.childMenu.reset();
            }
        }
        focusItem(predicate, subitems) {
            let item = this.findItem(predicate, subitems);
            if (item) {
                item.focus();
            }
        }
        findItem(predicate, subitems) {
            let foundItem = null;
            for (let idx = 0; idx < this.items.length; idx++) {
                let item = this.items[idx];
                if (predicate(item)) {
                    return item;
                }
                if (subitems && item.childMenu) {
                    foundItem = item.childMenu.findItem(predicate, subitems);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
            return foundItem;
        }
    };
    HTMLEMenuItemGroupElementBase = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: "e-menuitemgroup",
            observedAttributes: ["label"]
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: "label", type: "string" },
            { name: "type", type: "string" },
            { name: "name", type: "string" },
            { name: "rows", type: "number" },
            { name: "cells", type: "number" },
        ])
    ], HTMLEMenuItemGroupElementBase);
    exports.HTMLEMenuItemGroupElementBase = HTMLEMenuItemGroupElementBase;
});
//# sourceMappingURL=MenuItemGroup.js.map