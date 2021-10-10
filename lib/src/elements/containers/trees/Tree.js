var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
export { HTMLETreeElementBase };
let HTMLETreeElementBase = class HTMLETreeElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
        `);
        this.items = [];
        this._activeItem = null;
        this._selectedItem = null;
    }
    get activeItem() {
        return this._activeItem;
    }
    get selectedItem() {
        return this._selectedItem;
    }
    connectedCallback() {
        var _a;
        this.tabIndex = this.tabIndex;
        const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-treeitem", item));
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
                            if (isTagElement("e-treeitem", this.activeItem.parent)) {
                                this.focusItem(this.activeItem.parent);
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
                                this.focusItem(this.activeItem.items[0]);
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    if (this.activeItem) {
                        this.focusItem(this.activeItem.previousVisibleItem());
                    }
                    else if (this.items.length > 0) {
                        this.focusItem(this.items[0]);
                    }
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    if (this.activeItem) {
                        this.focusItem(this.activeItem.nextVisibleItem());
                    }
                    else if (this.items.length > 0) {
                        this.focusItem(this.items[this.items.length - 1]);
                    }
                    event.preventDefault();
                    break;
                case "Home":
                    if (this.items.length > 0) {
                        this.focusItem(this.items[0]);
                    }
                    event.preventDefault();
                    break;
                case "End":
                    if (this.items.length > 0) {
                        this.focusItem(this.items[this.items.length - 1].deepestVisibleChildItem());
                    }
                    event.preventDefault();
                    break;
                case "Enter":
                    if (this.activeItem) {
                        this.selectItem(this.activeItem);
                        this.activeItem.trigger();
                    }
                    break;
                case "Escape":
                    this.active = false;
                    this.reset();
                    this.focus();
                    break;
            }
        });
        this.addEventListener("click", (event) => {
            const target = event.target;
            if (isTagElement("e-treeitem", target)) {
                this.selectItem(target);
                target.trigger();
            }
        });
        this.addEventListener("focusin", (event) => {
            const target = event.target;
            if (!this.active) {
                this.active = true;
            }
            const closestItem = target.closest("e-treeitem");
            if (closestItem && this.contains(closestItem)) {
                this.focusItem(closestItem);
            }
        });
        this.addEventListener("focusout", (event) => {
            const relatedTarget = event.relatedTarget;
            if (!this.contains(relatedTarget)) {
                this.active = false;
                if (this.activeItem) {
                    this.activeItem.active = false;
                }
            }
        });
    }
    focusItem(item) {
        if (this.activeItem) {
            this.activeItem.active = false;
        }
        this._activeItem = item;
        this._activeItem.active = true;
        item.focus();
    }
    selectItem(item) {
        if (this._selectedItem) {
            this._selectedItem.selected = false;
        }
        this._selectedItem = item;
        this._selectedItem.selected = true;
    }
    reset() {
        if (this.activeItem) {
            this.activeItem.active = false;
        }
        if (this._selectedItem) {
            this._selectedItem.selected = false;
        }
    }
    findItem(predicate, subtree) {
        let foundItem = null;
        for (let item of this.items) {
            if (predicate(item)) {
                return item;
            }
            if (subtree && item.items) {
                for (let subitem of item.items) {
                    foundItem = subitem.findItem(predicate, subtree);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
        }
        return foundItem;
    }
};
HTMLETreeElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-tree"
    }),
    GenerateAttributeAccessors([
        { name: "active", type: "boolean" },
        { name: "name", type: "string" }
    ])
], HTMLETreeElementBase);
//# sourceMappingURL=Tree.js.map