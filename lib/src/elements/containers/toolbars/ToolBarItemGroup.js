var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HTML, CustomElement, AttributeProperty } from "../../Element";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
export { HTMLEToolBarItemGroupElement };
let HTMLEToolBarItemGroupElementBase = class HTMLEToolBarItemGroupElementBase extends HTMLElement {
    name;
    label;
    orientation;
    disabled;
    items;
    shadowRoot;
    #activeIndex;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                textContent: /*css*/ `
                        :host {
                            display: flex;
                            width: max-content;
                            flex-direction: row;
                        }

                        :host([orientation="vertical"]) {
                            flex-direction: column;
                        }

                        :host([orientation="horizontal"]) {
                            flex-direction: row;
                        }
                    `
            }
        }), HTML("slot"));
        this.#activeIndex = -1;
        this.items = [];
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeItem() {
        return this.items[this.activeIndex] || null;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("click", this);
        this.addEventListener("keydown", this);
    }
    handleEvent(event) {
        const { type, target } = event;
        switch (type) {
            case "slotchange":
                this.items = target
                    .assignedElements()
                    .filter(element_i => element_i instanceof HTMLEToolBarItemElement);
                break;
            case "click":
                if (target instanceof HTMLEToolBarItemElement && target.type === "radio" && !target.disabled) {
                    const previouslyCheckedRadio = this.items
                        .find(item => item.type === "radio" && item.checked && item !== target);
                    if (previouslyCheckedRadio) {
                        previouslyCheckedRadio.checked = false;
                    }
                }
                break;
            case "focusout":
                const lostFocusWithin = !this.contains(event.relatedTarget);
                if (lostFocusWithin) {
                    this.reset();
                }
                break;
            case "focusin":
                if (target instanceof Element) {
                    this.#activeIndex = this.items.findIndex((item) => item.contains(target));
                }
                break;
            case "keydown":
                switch (event.key) {
                    case "ArrowUp":
                        if (this.orientation === "vertical" && this.activeIndex > 0) {
                            this.focusItem(this.activeIndex - 1);
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowDown":
                        if (this.orientation === "vertical" && this.activeIndex < this.items.length - 1) {
                            this.focusItem(this.activeIndex + 1);
                            event.stopPropagation();
                        }
                        break;
                    case "Enter":
                        if (this.activeItem) {
                            this.activeItem.click();
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowLeft":
                        if ((!this.orientation || this.orientation === "horizontal") && this.activeIndex > 0) {
                            this.focusItem(this.activeIndex - 1);
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowRight":
                        if ((!this.orientation || this.orientation === "horizontal") && this.activeIndex < this.items.length - 1) {
                            this.focusItem(this.activeIndex + 1);
                            event.stopPropagation();
                        }
                        break;
                    case "Home":
                        this.focusItem(0);
                        break;
                    case "End":
                        this.focusItem(this.items.length - 1);
                        break;
                    case "Escape":
                        this.reset();
                        break;
                }
                break;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const label = this.shadowRoot.querySelector("[part='label']");
                        if (label) {
                            label.textContent = newValue;
                        }
                    }
                    break;
                case "disabled":
                    if (oldValue !== newValue) {
                        this.items.forEach((item) => {
                            item.disabled = newValue !== null;
                        });
                    }
                    break;
            }
        }
    }
    focusItem(index) {
        const item = this.items[index];
        if (item) {
            this.#activeIndex = index;
            item.focus();
        }
    }
    reset() {
        this.#activeIndex = -1;
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemGroupElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemGroupElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemGroupElementBase.prototype, "orientation", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEToolBarItemGroupElementBase.prototype, "disabled", void 0);
HTMLEToolBarItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-toolbaritemgroup"
    })
], HTMLEToolBarItemGroupElementBase);
var HTMLEToolBarItemGroupElement = HTMLEToolBarItemGroupElementBase;
//# sourceMappingURL=ToolBarItemGroup.js.map