var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
export { HTMLETreeItemElement };
let HTMLETreeItemElementBase = class HTMLETreeItemElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 0;
                    cursor: pointer;

                    --indent-width: 6px;
                }
                
                [part~="content"]:hover,
                :host([active]:not([selected])) [part~="content"] {
                    background-color: whitesmoke;
                }

                :host([selected]) [part~="content"] {
                    background-color: gainsboro;
                }

                :host(:not([expanded])) [part~="container"] {
                    display: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    display: flex;
                    padding-left: calc(var(--tree-indent) * var(--indent-width));
                }

                [part~="label"],
                ::slotted([slot="label"]) {
                    display: block;
                    width: 100%;
                    pointer-events: none;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                :host([leaf]) [part~="container"],
                [part~="container"]:empty {
                    display: none;
                }

                [part~="toggle_arrow"] {
                    flex: none;
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    margin: 2px;
                    margin-right: 6px;
                    border-radius: 2px;
                }

                :host([leaf]) [part~="toggle_arrow"] {
                    visibility: hidden;
                }

                [part~="toggle_arrow"]::after {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    color: dimgray;
                    text-align: center;
                }

                :host(:not([expanded])) [part~="toggle_arrow"]::after {
                    content: "►";
                }

                :host([expanded]) [part~="toggle_arrow"]::after {
                    content: "▼";
                }

                [part~="state"] {
                    flex: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <span part="content">
                <span part="toggle_arrow"></span>
                <slot name="label"><span part="label"></span></slot>
            </span>
            <div part="container">
                <slot></slot>
            </div>
        `);
        this.items = [];
        this.parent = null;
        this.indent = 0;
    }
    connectedCallback() {
        var _a;
        this.tabIndex = this.tabIndex;
        const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot:not([name])");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => item instanceof HTMLETreeItemElement);
                this.items = items;
                this.items.forEach((item) => {
                    item.parent = this;
                    item.indent = this.indent + 1;
                });
            });
        }
        const content = this.shadowRoot.querySelector("[part=content]");
        content.addEventListener("click", () => {
            this.toggle();
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var _a, _b;
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
                case "icon":
                    if (oldValue !== newValue) {
                        const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                        if (iconPart) {
                            iconPart.dataset.value = newValue;
                        }
                    }
                    break;
                case "indent":
                    if (oldValue !== newValue) {
                        this.style.setProperty("--tree-indent", newValue);
                    }
                    break;
            }
        }
    }
    deepestVisibleChildItem() {
        if (this.expanded && this.items.length > 0) {
            let lastChildItem = this.items[this.items.length - 1];
            return lastChildItem.deepestVisibleChildItem();
        }
        return this;
    }
    previousVisibleItem() {
        if (this.parent) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis > 0) {
                let previousItem = this.parent.items[indexOfThis - 1];
                return previousItem.deepestVisibleChildItem();
            }
            return this.parent instanceof HTMLETreeItemElement ? this.parent : this;
        }
        return this;
    }
    nextVisibleItem() {
        if (this.expanded && this.items.length > 0) {
            return this.items[0];
        }
        let nearestItem = this.nearestParentItem();
        if (nearestItem.parent) {
            let indexOfNearest = nearestItem.parent.items.indexOf(nearestItem);
            if (indexOfNearest < nearestItem.parent.items.length - 1) {
                return nearestItem.parent.items[indexOfNearest + 1];
            }
        }
        return this;
    }
    nearestParentItem() {
        if (this.parent instanceof HTMLETreeItemElement) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis === this.parent.items.length - 1) {
                return this.parent.nearestParentItem();
            }
        }
        return this;
    }
    toggle() {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent("e_toggle", { bubbles: true }));
    }
    trigger() {
        this.dispatchEvent(new CustomEvent("e_trigger", { bubbles: true }));
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
HTMLETreeItemElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-treeitem",
        observedAttributes: ["icon", "label", "expanded", "indent"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "label", type: "string" },
        { name: "icon", type: "string" },
        { name: "indent", type: "number" },
        { name: "active", type: "boolean" },
        { name: "selected", type: "boolean" },
        { name: "expanded", type: "boolean" },
        { name: "leaf", type: "boolean" }
    ])
], HTMLETreeItemElementBase);
var HTMLETreeItemElement = HTMLETreeItemElementBase;
//# sourceMappingURL=TreeItem.js.map