var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { pointIntersectsWithDOMRect } from "../../Snippets";
export { HTMLEMenuElementBase };
let HTMLEMenuElementBase = class HTMLEMenuElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    user-select: none;

                    padding: 6px 0;
                    background-color: white;
                    cursor: initial;
                    width: max-content;

                    -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                    -moz-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }

                ::slotted(hr) {
                    margin: 6px 0;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
        `);
        this.parentItem = null;
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
                const items = slot.assignedElements().filter(elem => isTagElement("e-menuitem", elem) || isTagElement("e-menuitemgroup", elem));
                this.items = items;
                items.forEach((item) => {
                    item.parentMenu = this;
                });
            });
        }
        this.addEventListener("mousedown", (event) => {
            let target = event.target;
            if (isTagElement("e-menuitem", target)) {
                let thisIncludesTarget = this.items.includes(target);
                if (thisIncludesTarget) {
                    target.trigger();
                }
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
                if (isTagElement("e-menuitem", target)) {
                    this.focusItemAt(targetIndex, true);
                }
                else {
                    this._activeIndex = targetIndex;
                }
            }
        });
        this.addEventListener("mouseout", (event) => {
            let target = event.target;
            let thisIntersectsWithMouse = pointIntersectsWithDOMRect(event.clientX, event.clientY, this.getBoundingClientRect());
            if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                this.reset();
                this.focus();
            }
        });
        this.addEventListener("focusin", (event) => {
            let target = event.target;
            this._activeIndex = this.items.findIndex((item) => item.contains(target));
            this.expanded = true;
        });
        this.addEventListener("focusout", (event) => {
            let newTarget = event.relatedTarget;
            if (!this.contains(newTarget)) {
                this.reset();
                this.expanded = false;
            }
        });
        this.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                    }
                    event.stopPropagation();
                    break;
                case "ArrowDown":
                    this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(0);
                    }
                    event.stopPropagation();
                    break;
                case "Home":
                    this.focusItemAt(0);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(0);
                    }
                    event.stopPropagation();
                    break;
                case "End":
                    this.focusItemAt(this.items.length - 1);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                    }
                    event.stopPropagation();
                    break;
                case "Enter":
                    if (isTagElement("e-menuitem", this.activeItem)) {
                        this.activeItem.trigger();
                        event.stopPropagation();
                    }
                    break;
                case "Escape":
                    if (this.parentItem) {
                        let parentGroup = this.parentItem.group;
                        let parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                        if (isTagElement("e-menu", parentMenu)) {
                            if (parentGroup) {
                                parentGroup.focusItemAt(parentGroup.activeIndex);
                            }
                            else {
                                parentMenu.focusItemAt(parentMenu.activeIndex);
                            }
                            this.reset();
                            event.stopPropagation();
                        }
                    }
                    else {
                        document.body.focus();
                    }
                    break;
                case "ArrowLeft":
                    if (this.parentItem) {
                        let parentGroup = this.parentItem.group;
                        let parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                        if (isTagElement("e-menu", parentMenu)) {
                            if (parentGroup) {
                                parentGroup.focusItemAt(parentGroup.activeIndex);
                            }
                            else {
                                parentMenu.focusItemAt(parentMenu.activeIndex);
                            }
                            this.reset();
                            event.stopPropagation();
                        }
                    }
                    break;
                case "ArrowRight":
                    if (this.items.includes(event.target)) {
                        if (isTagElement("e-menuitem", this.activeItem) && this.activeItem.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                            event.stopPropagation();
                        }
                    }
                    break;
            }
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            switch (name) {
                case "expanded":
                    if (newValue !== null) {
                        let thisRect = this.getBoundingClientRect();
                        let thisIsOverflowing = thisRect.right > document.body.clientWidth;
                        if (thisIsOverflowing) {
                            this.overflowing = true;
                        }
                    }
                    else {
                        this.overflowing = false;
                    }
                    break;
            }
        }
    }
    focusItemAt(index, childMenu) {
        let item = this.items[index];
        if (item) {
            this._activeIndex = index;
            item.focus();
            if (isTagElement("e-menuitem", item)) {
                if (childMenu && item.childMenu) {
                    item.childMenu.focus();
                }
            }
            else {
                item.focusItemAt(0);
            }
        }
    }
    reset() {
        let item = this.activeItem;
        this._activeIndex = -1;
        if (isTagElement("e-menuitem", item) && item.childMenu) {
            item.childMenu.reset();
        }
    }
    findItem(predicate, subitems) {
        let foundItem = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
            if (isTagElement("e-menuitem", item)) {
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
            else if (isTagElement("e-menuitemgroup", item)) {
                foundItem = item.findItem(predicate, subitems);
                if (foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
};
HTMLEMenuElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-menu",
        observedAttributes: ["expanded"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "expanded", type: "boolean" },
        { name: "overflowing", type: "boolean" }
    ])
], HTMLEMenuElementBase);
//# sourceMappingURL=Menu.js.map