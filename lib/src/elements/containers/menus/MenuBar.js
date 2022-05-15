var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuBarElement };
let HTMLEMenuBarElementBase = class HTMLEMenuBarElementBase extends HTMLElement {
    name;
    active;
    shadowRoot;
    #items;
    #activeIndex;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: block;
                            width: max-content;
                        }
        
                        :host(:focus) ::slotted(:hover),
                        :host(:not(:focus-within)) ::slotted(:hover) {
                            color: black;
                            background-color: gainsboro;
                        }
        
                        [part="container"] {
                            display: flex;
                            flex-direction: row;
                        }
                    `
            }
        }), HTML("div", {
            part: ["container"],
            children: [
                HTML("slot")
            ]
        }));
        this.#items = [];
        this.#activeIndex = -1;
    }
    set #active(active) {
        this.active = active;
    }
    get items() {
        return this.#items;
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeItem() {
        return this.items[this.#activeIndex] || null;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("mouseover", this);
        this.addEventListener("keydown", this);
        this.addEventListener("click", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
    }
    handleEvent(event) {
        const { type: eventType, target: eventTarget } = event;
        const { items } = this;
        let { active, activeIndex, activeItem } = this;
        switch (eventType) {
            case "slotchange":
                this.#items = eventTarget
                    .assignedElements()
                    .filter(element_i => element_i instanceof HTMLEMenuItemElement);
                break;
            case "click":
                if (eventTarget instanceof HTMLEMenuItemElement) {
                    const targetIndex = items.indexOf(eventTarget);
                    if (targetIndex > -1) {
                        if (activeItem && activeItem.expanded) {
                            activeItem.focusMenu();
                            this.#active = true;
                        }
                        else {
                            document.body.focus({ preventScroll: true });
                            this.#active = false;
                        }
                        event.preventDefault();
                    }
                }
                break;
            case "mouseover":
                if (eventTarget instanceof HTMLEMenuItemElement) {
                    const targetIndex = items.indexOf(eventTarget);
                    if (targetIndex > -1 && active) {
                        eventTarget.focusMenu();
                    }
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
                        this.#active = true;
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
                    this.#active = false;
                }
                break;
            case "keydown":
                switch (event.key) {
                    case "ArrowLeft":
                        this.focusItem((activeIndex === -1) ?
                            0 :
                            (activeIndex === 0) ?
                                items.length - 1 :
                                activeIndex - 1);
                        ({ activeItem } = this);
                        if (active && activeItem) {
                            activeItem.focusMenu({ firstItem: true });
                        }
                        event.stopPropagation();
                        break;
                    case "ArrowRight":
                        this.focusItem((activeIndex === -1) ?
                            items.length - 1 :
                            (activeIndex === items.length - 1) ?
                                0 :
                                activeIndex + 1);
                        ({ activeItem } = this);
                        if (active && activeItem) {
                            activeItem.focusMenu({ firstItem: true });
                        }
                        event.stopPropagation();
                        break;
                    case "ArrowDown":
                        if (activeItem) {
                            activeItem.focusMenu({ firstItem: true });
                        }
                        event.stopPropagation();
                        break;
                    case "Enter":
                        if (activeItem) {
                            activeItem.focusMenu({ firstItem: true });
                        }
                        event.stopPropagation();
                        break;
                    case "Escape":
                        if (active) {
                            this.focusItem(activeIndex);
                            this.#active = false;
                        }
                        else {
                            document.body.focus({ preventScroll: true });
                        }
                        event.stopPropagation();
                        break;
                }
                break;
        }
    }
    focusItem(index, options) {
        const { items } = this;
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
], HTMLEMenuBarElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuBarElementBase.prototype, "active", void 0);
HTMLEMenuBarElementBase = __decorate([
    CustomElement({
        name: "e-menubar"
    })
], HTMLEMenuBarElementBase);
var HTMLEMenuBarElement = HTMLEMenuBarElementBase;
//# sourceMappingURL=MenuBar.js.map