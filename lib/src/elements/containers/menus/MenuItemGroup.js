var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HTML, CustomElement, AttributeProperty } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuItemGroupElement };
let HTMLEMenuItemGroupElementBase = class HTMLEMenuItemGroupElementBase extends HTMLElement {
    name;
    label;
    disabled;
    shadowRoot;
    #items;
    #activeIndex;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                textContent: /*css*/ `
                        :host {
                            display: flex;
                            flex-direction: column;
                        }
                    `
            }
        }), HTML("slot"));
        this.#activeIndex = -1;
        this.#items = [];
    }
    get items() {
        return this.#items;
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeItem() {
        return this.#items[this.activeIndex] ?? null;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("mouseover", this);
        this.addEventListener("mouseout", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("click", this);
        this.addEventListener("keydown", this);
    }
    handleEvent(event) {
        const { type: eventType, target: eventTarget } = event;
        const { activeIndex } = this;
        const items = this.#items;
        let { activeItem } = this;
        switch (eventType) {
            case "slotchange":
                const { target } = event;
                const assignedItems = target
                    .assignedElements()
                    .filter(element_i => element_i instanceof HTMLEMenuItemElement);
                assignedItems.forEach((item_i, i) => {
                    item_i.index = i;
                });
                this.#items = assignedItems.slice();
                break;
            case "click":
                if (eventTarget instanceof HTMLEMenuItemElement && eventTarget.type === "radio" && !eventTarget.disabled) {
                    const previouslyCheckedRadio = items
                        .find(item => item.type === "radio" && item.checked && item !== eventTarget);
                    if (previouslyCheckedRadio) {
                        previouslyCheckedRadio.checked = false;
                    }
                }
                break;
            case "mouseover":
                if (eventTarget instanceof HTMLEMenuItemElement) {
                    const targetIndex = items.indexOf(eventTarget);
                    if (targetIndex >= 0) {
                        this.focusItem(targetIndex);
                        ({ activeItem } = this);
                        if (activeItem) {
                            activeItem.focusMenu();
                        }
                    }
                }
                break;
            case "mouseout":
                const { clientX, clientY } = event;
                const { left, right, top, bottom } = this.getBoundingClientRect();
                const intersectsWithMouse = !(left > clientX || right < clientX || top > clientY || bottom < clientY);
                const isTarget = eventTarget === this;
                const includesTarget = items.includes(eventTarget);
                if ((isTarget || includesTarget) && !intersectsWithMouse) {
                    this.reset();
                    this.focus({ preventScroll: true });
                }
                break;
            case "focusin":
                const focusInTargetIndex = items.findIndex((item) => item.contains(eventTarget));
                if (focusInTargetIndex > -1) {
                    if (focusInTargetIndex !== activeIndex) {
                        this.reset();
                    }
                    const focusInTargetItem = items[focusInTargetIndex];
                    if (focusInTargetItem !== eventTarget) {
                        if (!focusInTargetItem.expanded) {
                            focusInTargetItem.toggle(true);
                        }
                    }
                }
                this.#activeIndex = focusInTargetIndex;
                break;
            case "focusout":
                const lostFocusWithin = !this.contains(event.relatedTarget);
                if (lostFocusWithin) {
                    this.reset();
                }
                break;
            case "keydown":
                switch (event.key) {
                    case "ArrowUp":
                        if (activeIndex > 0) {
                            this.focusItem(activeIndex - 1);
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowDown":
                        if (activeIndex < items.length - 1) {
                            this.focusItem(activeIndex + 1);
                            event.stopPropagation();
                        }
                        break;
                    case "Enter":
                        if (activeItem) {
                            const { type } = activeItem;
                            switch (type) {
                                case "menu":
                                case "submenu":
                                    activeItem.toggle();
                                    if (activeItem.expanded) {
                                        activeItem.focusMenu({ firstItem: true });
                                    }
                                    break;
                                default:
                                    activeItem.trigger();
                                    break;
                            }
                            event.stopPropagation();
                        }
                        break;
                    case "Escape":
                        if (activeItem && activeItem.expanded) {
                            this.focusItem(activeIndex, { expand: false });
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowLeft":
                        if (activeItem && activeItem.expanded) {
                            this.focusItem(activeIndex, { expand: false });
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowRight":
                        if (activeItem && (activeItem === eventTarget || this === eventTarget)) {
                            const { type } = activeItem;
                            if (type === "submenu") {
                                activeItem.focusMenu({ firstItem: true });
                                event.stopPropagation();
                            }
                        }
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
                        const items = this.#items;
                        items.forEach((item_i) => {
                            item_i.disabled = newValue !== null;
                        });
                    }
                    break;
            }
        }
    }
    focusItem(index, options) {
        const items = this.#items;
        const item = items[index];
        if (item) {
            const expand = options?.expand ?? false;
            item.focus({ preventScroll: true });
            item.toggle(expand);
        }
    }
    reset() {
        const { activeItem } = this;
        if (activeItem) {
            if (activeItem.expanded) {
                activeItem.toggle(false);
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuItemGroupElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEMenuItemGroupElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEMenuItemGroupElementBase.prototype, "disabled", void 0);
HTMLEMenuItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-menuitemgroup"
    })
], HTMLEMenuItemGroupElementBase);
var HTMLEMenuItemGroupElement = HTMLEMenuItemGroupElementBase;
//# sourceMappingURL=MenuItemGroup.js.map