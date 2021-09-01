var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, isTagElement, bindShadowRoot } from "editor/elements/HTMLElement";
export { HTMLETreeViewItemElementBase };
let HTMLETreeViewItemElementBase = class HTMLETreeViewItemElementBase extends HTMLElement {
    constructor() {
        super();
        let collapseArrowUrl = JSON.stringify("../assets/editor/icons/chevron_right_black_18dp.svg");
        let expandArrowUrl = JSON.stringify("../assets/editor/icons/expand_more_black_18dp.svg");
        bindShadowRoot(this, /*template*/ `
            <link rel="preload" href=${collapseArrowUrl} as="image" crossorigin>
            <link rel="preload" href=${expandArrowUrl} as="image" crossorigin>
            <style>
                :host {
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 0;
                    cursor: pointer;

                    --indent-width: 6px;
                    --collapsed-arrow-url: url(${collapseArrowUrl});
                    --expanded-arrow-url: url(${expandArrowUrl});
                }
                
                :host([active]) [part~="content"],
                [part~="content"]:hover {
                    background-color: gainsboro;
                }

                :host(:not([expanded])) [part~="container"] {
                    display: none;
                }

                [part~="li"] {
                    display: block;
                    height: 100%;
                    list-style-type: none;
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

                [part~="toggle_arrow"]:hover {
                    background-color: lightgray;
                }

                :host([leaf]) [part~="container"],
                [part~="container"]:empty {
                    display: none;
                }

                [part~="toggle_arrow"] {
                    flex: none;
                    display: inline-block;
                    width: 18px;
                    margin-right: 4px;
                }

                :host([leaf]) [part~="toggle_arrow"] {
                    visibility: hidden;
                }

                [part~="toggle_arrow"]::after {
                    content: "";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    background-color: dimgray;
                }

                :host([expanded]) [part~="toggle_arrow"]::after {
                    -webkit-mask-image: var(--expanded-arrow-url);
                    mask-image: var(--expanded-arrow-url);
                }
                
                :host(:not([expanded])) [part~="toggle_arrow"]::after {
                    -webkit-mask-image: var(--collapsed-arrow-url);
                    mask-image: var(--collapsed-arrow-url);
                }

                [part~="state"] {
                    flex: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    margin: 0;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="toggle_arrow"></span>
                    <slot name="label"><span part="label"></span></slot>
                </span>
                <ul part="container">
                    <slot></slot>
                </ul>
            </li>
        `);
        this.items = [];
        this.parent = null;
        this.indent = 0;
        this._toggleArrow = this.shadowRoot.querySelector("[part~=toggle_arrow]");
    }
    connectedCallback() {
        var _a;
        this.tabIndex = this.tabIndex;
        const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot:not([name])");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-treeviewitem", item));
                this.items = items;
                this.items.forEach((item) => {
                    item.parent = this;
                    item.indent = this.indent + 1;
                });
                this.dataset.empty = (this.items.length > 0) ? "" : void 0;
            });
        }
        this.shadowRoot.addEventListener("mousedown", (event) => {
            let target = event.target;
            if (target === this._toggleArrow) {
                this.toggle();
            }
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
            return isTagElement("e-treeviewitem", this.parent) ? this.parent : this;
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
        if (isTagElement("e-treeviewitem", this.parent)) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis === this.parent.items.length - 1) {
                return this.parent.nearestParentItem();
            }
        }
        return this;
    }
    toggle() {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent("e-toggle", { bubbles: true }));
    }
    trigger() {
        this.dispatchEvent(new CustomEvent("e-trigger", { bubbles: true }));
    }
};
HTMLETreeViewItemElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-treeviewitem",
        observedAttributes: ["icon", "label", "expanded", "indent"]
    }),
    GenerateAttributeAccessors([
        { name: "name", type: "string" },
        { name: "label", type: "string" },
        { name: "icon", type: "string" },
        { name: "indent", type: "number" },
        { name: "active", type: "boolean" },
        { name: "expanded", type: "boolean" },
        { name: "leaf", type: "boolean" }
    ])
], HTMLETreeViewItemElementBase);
//# sourceMappingURL=TreeViewItem.js.map