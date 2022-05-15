var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
export { HTMLEMenuElement };
let HTMLEMenuElementBase = class HTMLEMenuElementBase extends HTMLElement {
    name;
    shadowRoot;
    #activeIndex;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
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
        
                        [part="container"] {
                            display: flex;
                            flex-direction: column;
                        }
        
                        ::slotted(hr) {
                            width: calc(100% - 12px);
                            margin: 6px;
                        }
                    `
            }
        }), HTML("div", {
            part: ["container"],
            children: [
                HTML("slot")
            ]
        }));
        this.addEventListener("mouseover", this.#handleMouseOver.bind(this));
        this.addEventListener("mouseout", this.#handleMouseOut.bind(this));
        this.addEventListener("focusin", this.#handleFocusIn.bind(this));
        this.addEventListener("focusout", this.#handleFocusOut.bind(this));
        this.addEventListener("keydown", this.#handleKeyDown.bind(this));
        this.#activeIndex = -1;
    }
    get groups() {
        const { children } = this;
        return Array.from(children).filter(child_i => child_i instanceof HTMLEMenuItemGroupElement);
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeGroup() {
        const { groups } = this;
        return groups[this.#activeIndex] ?? null;
    }
    #handleMouseOver(event) {
        const { target } = event;
        const { groups } = this;
        if (target instanceof HTMLEMenuItemGroupElement) {
            const targetIndex = groups.indexOf(target);
            if (targetIndex >= 0) {
                this.focusGroup(targetIndex);
            }
        }
    }
    #handleMouseOut(event) {
        const { target, relatedTarget } = event;
        const { groups, activeIndex } = this;
        const { clientX, clientY } = event;
        const { left, right, top, bottom } = this.getBoundingClientRect();
        const intersectsWithMouse = !(left > clientX || right < clientX || top > clientY || bottom < clientY);
        const isTarget = target === this;
        const isRelatedTarget = relatedTarget === this;
        const includesTarget = groups.includes(target);
        if (isRelatedTarget || (isTarget || includesTarget) && !intersectsWithMouse) {
            this.reset();
            this.focus({ preventScroll: true });
            if (isRelatedTarget) {
                this.#activeIndex = activeIndex;
            }
        }
    }
    #handleFocusIn(event) {
        const { target } = event;
        const { groups, activeIndex } = this;
        const focusInTargetIndex = groups.findIndex((group) => group.contains(target));
        if (focusInTargetIndex > -1) {
            if (focusInTargetIndex !== activeIndex) {
                this.reset();
            }
        }
        this.#activeIndex = focusInTargetIndex;
    }
    #handleFocusOut(event) {
        const { relatedTarget } = event;
        const lostFocusWithin = !this.contains(relatedTarget);
        if (lostFocusWithin) {
            this.reset();
        }
    }
    #handleKeyDown(event) {
        const { groups, activeIndex } = this;
        let { activeGroup } = this;
        const { key } = event;
        switch (key) {
            case "ArrowUp":
                this.focusGroup(activeIndex <= 0 ?
                    groups.length - 1 :
                    activeIndex - 1);
                ({ activeGroup } = this);
                if (activeGroup) {
                    const { items: groupItems } = activeGroup;
                    activeGroup.focusItem(groupItems.length - 1);
                }
                event.stopPropagation();
                break;
            case "ArrowDown":
                this.focusGroup(activeIndex >= groups.length - 1 ?
                    0 :
                    activeIndex + 1);
                ({ activeGroup } = this);
                if (activeGroup) {
                    activeGroup.focusItem(0);
                }
                event.stopPropagation();
                break;
            case "Home":
                this.focusGroup(0);
                ({ activeGroup } = this);
                if (activeGroup) {
                    activeGroup.focusItem(0);
                }
                event.stopPropagation();
                break;
            case "End":
                this.focusGroup(groups.length - 1);
                ({ activeGroup } = this);
                if (activeGroup) {
                    const { items: groupItems } = activeGroup;
                    activeGroup.focusItem(groupItems.length - 1);
                }
                event.stopPropagation();
                break;
        }
    }
    focusGroup(index, options) {
        const { groups } = this;
        const group = groups[index];
        if (group) {
            const firstItem = options?.firstItem ?? false;
            if (firstItem) {
                group.focusItem(0);
            }
            else {
                group.focus({ preventScroll: true });
            }
        }
    }
    reset() {
        const { activeGroup } = this;
        if (activeGroup) {
            activeGroup.reset();
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuElementBase.prototype, "name", void 0);
HTMLEMenuElementBase = __decorate([
    CustomElement({
        name: "e-menu"
    })
], HTMLEMenuElementBase);
var HTMLEMenuElement = HTMLEMenuElementBase;
//# sourceMappingURL=Menu.js.map