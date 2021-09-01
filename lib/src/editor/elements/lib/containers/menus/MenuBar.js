var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "src/editor/elements/HTMLElement";
export { HTMLEMenuBarElementBase };
let HTMLEMenuBarElementBase = class HTMLEMenuBarElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    user-select: none;
                }
                
                :host(:focus) {
                    /*outline: 1px solid -webkit-focus-ring-color;*/
                    color: black;
                    background-color: gainsboro;
                }

                /*:host(:focus) ::slotted(:first-child),*/
                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
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
        this._activeIndex = -1;
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
                    .filter(item => isTagElement("e-menuitem", item));
                this.items = items;
                items.forEach((item) => {
                    item.parentMenu = this;
                });
            });
        }
        this.addEventListener("mouseover", (event) => {
            let targetIndex = this.items.indexOf(event.target);
            if (targetIndex >= 0) {
                if (this.contains(document.activeElement)) {
                    if (this.active) {
                        this.focusItemAt(targetIndex, true);
                    }
                    else {
                        this._activeIndex = targetIndex;
                    }
                }
            }
        });
        this.addEventListener("keydown", (event) => {
            var _a, _b, _c;
            switch (event.key) {
                case "ArrowLeft":
                    this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                    if (this.active && ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.childMenu)) {
                        this.activeItem.childMenu.focusItemAt(0);
                    }
                    break;
                case "ArrowRight":
                    this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                    if (this.active && ((_b = this.activeItem) === null || _b === void 0 ? void 0 : _b.childMenu)) {
                        this.activeItem.childMenu.focusItemAt(0);
                    }
                    break;
                case "ArrowDown":
                    this.focusItemAt(this.activeIndex);
                    if (this.active && ((_c = this.activeItem) === null || _c === void 0 ? void 0 : _c.childMenu)) {
                        this.activeItem.childMenu.focusItemAt(0);
                    }
                    break;
                case "Enter":
                    this.active = true;
                    if (this.activeItem) {
                        this.activeItem.trigger();
                    }
                    break;
                case "Escape":
                    this.focusItemAt(this.activeIndex);
                    this.active = false;
                    break;
            }
        });
        this.addEventListener("mousedown", (event) => {
            let targetIndex = this.items.indexOf(event.target);
            if (targetIndex >= 0) {
                if (!this.contains(document.activeElement)) {
                    this.active = true;
                    this.focusItemAt(targetIndex, true);
                }
                else {
                    this.active = false;
                    document.body.focus();
                }
                event.preventDefault();
            }
        });
        this.addEventListener("focus", () => {
            this._activeIndex = 0;
        });
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
    focusItem(predicate, subtree) {
        let item = this.findItem(predicate, subtree);
        if (item) {
            item.focus();
        }
    }
    reset() {
        let item = this.activeItem;
        this._activeIndex = -1;
        if (item === null || item === void 0 ? void 0 : item.childMenu) {
            item.childMenu.reset();
        }
    }
    findItem(predicate, subtree) {
        let foundItem = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
            if (predicate(item)) {
                return item;
            }
            if (subtree && item.childMenu) {
                foundItem = item.childMenu.findItem(predicate, subtree);
                if (foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
};
HTMLEMenuBarElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menubar"
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "active", type: "boolean" },
    ])
], HTMLEMenuBarElementBase);
//# sourceMappingURL=MenuBar.js.map