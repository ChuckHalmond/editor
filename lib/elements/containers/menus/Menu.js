var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HTMLEMenuElementBase_1;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
import "./MenuItem";
import "./MenuItemGroup";
import { constructor } from "../../Snippets";
export { HTMLEMenuElement };
export { EMenu };
var shadowTemplate;
var style;
var toggleAnimations;
var HIDE_DELAY_MS = 200;
var SHOW_DELAY_MS = 400;
let HTMLEMenuElementBase = HTMLEMenuElementBase_1 = class HTMLEMenuElementBase extends HTMLElement {
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem"));
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeItem() {
        const { activeIndex } = this;
        return (this.querySelector(":is(:scope, :scope > e-menuitemgroup) > e-menuitem:focus-within") ?? activeIndex > -1) ? this.items()[activeIndex] ?? null : null;
    }
    #walker;
    #activeIndex;
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("slot"));
        style = /*css*/ `
            :host {
                display: flex;
                flex-direction: column;
            
                padding: 3px;
                background-color: white;
                width: max-content;
                box-sizing: border-box;
            
                -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px;
                box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px;
            }
            
            :host([contextual]) {
                z-index: 1;
                position: absolute;
            }
        `;
        toggleAnimations = new WeakMap();
    }
    constructor() {
        super();
        this.#activeIndex = -1;
        this.#walker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this));
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }
    connectedCallback() {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
    }
    positionContextual(x, y) {
        const { style } = this;
        const { width: menuWidth, height: menuHeight } = this.getBoundingClientRect();
        const { scrollX, scrollY } = window;
        const left = x + scrollX;
        const top = y + scrollY;
        const { clientWidth, clientHeight } = document.body;
        const overflowX = left + menuWidth - clientWidth;
        const overflowY = top + menuHeight - clientHeight;
        style.setProperty("left", `${overflowX > 0 ? left - menuWidth : left}px`);
        style.setProperty("top", `${overflowY > 0 ? top - menuHeight : top}px`);
    }
    #collapseSubmenus() {
        this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem[expanded]")
            .forEach((item_i) => {
            item_i.collapse();
        });
    }
    #nearestItem(target) {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem")).find(item_i => item_i.contains(target)) ?? null;
    }
    #walkerNodeFilter(node) {
        if (node instanceof HTMLEMenuItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEMenuItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }
    firstItem() {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
    #lastItem() {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return walker.lastChild();
    }
    #previousItem(item) {
        const walker = this.#walker;
        walker.currentNode = item;
        return walker.previousNode();
    }
    #nextItem(item) {
        const walker = this.#walker;
        walker.currentNode = item;
        return walker.nextNode();
    }
    #firstChildItem(item) {
        const { menu } = item;
        return menu instanceof HTMLEMenuElementBase_1 ?
            menu.firstItem() :
            null;
    }
    #setActiveItem(item) {
        if (item !== null) {
            this.#activeIndex = this.items().indexOf(item);
        }
    }
    #handleClickEvent(event) {
        const { target } = event;
        const targetItem = target.closest("e-menuitem");
        if (targetItem) {
            const { type, checked } = targetItem;
            switch (type) {
                case "checkbox": {
                    targetItem.checked = !checked;
                    break;
                }
                case "radio": {
                    const { name, value } = targetItem;
                    targetItem.checked = true;
                    this.querySelectorAll(`:is(:scope, :scope > e-menuitemgroup) > e-menuitem[type=radio][name=${name}]`)
                        .forEach((radio_i) => {
                        radio_i.checked = radio_i.value == value;
                    });
                    break;
                }
                case "menu":
                case "submenu": {
                    targetItem.toggle();
                    break;
                }
            }
        }
        event.stopPropagation();
    }
    #handleFocusInEvent(event) {
        const { target } = event;
        if (target instanceof HTMLEMenuItemElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem) {
                this.#setActiveItem(nearestItem);
            }
        }
    }
    #handleFocusOutEvent(event) {
        const { relatedTarget } = event;
        const lostFocusWithin = !this.contains(relatedTarget);
        if (lostFocusWithin) {
            const { contextual } = this;
            if (contextual) {
                try {
                    this.remove();
                }
                catch (error) { }
                ;
            }
            else {
                const { activeItem } = this;
                if (activeItem?.expanded) {
                    activeItem.collapse();
                }
                this.#setActiveItem(null);
            }
        }
    }
    #handleKeyDownEvent(event) {
        const { key } = event;
        const { activeItem } = this;
        switch (key) {
            case "ArrowUp": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem() :
                    this.firstItem();
                previousItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.firstItem() :
                    this.firstItem();
                nextItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.firstItem();
                firstItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                lastItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    const { type } = activeItem;
                    switch (type) {
                        case "menu":
                        case "submenu": {
                            activeItem.expand();
                            if (activeItem.expanded) {
                                const firstChildItem = this.#firstChildItem(activeItem);
                                firstChildItem?.focus({ preventScroll: true });
                            }
                            break;
                        }
                        default: {
                            activeItem.click();
                            break;
                        }
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(target_i => target_i instanceof HTMLEMenuElement) == this;
                    if (!isClosestTargetMenu) {
                        activeItem.collapse();
                        activeItem.focus({ preventScroll: true });
                        event.stopPropagation();
                    }
                    else {
                        const { contextual } = this;
                        if (contextual) {
                            this.blur();
                            this.dispatchEvent(new Event("close", { bubbles: true }));
                            event.stopPropagation();
                        }
                    }
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(target_i => target_i instanceof HTMLEMenuElement) == this;
                    if (!isClosestTargetMenu) {
                        activeItem.collapse();
                        activeItem.focus({ preventScroll: true });
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const { type } = activeItem;
                    switch (type) {
                        case "submenu": {
                            if (!activeItem.expanded) {
                                activeItem.expand();
                                const firstChildItem = this.#firstChildItem(activeItem);
                                firstChildItem?.focus({ preventScroll: true });
                                event.stopPropagation();
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    #handleMouseOutEvent(event) {
        const { target, relatedTarget } = event;
        if (target instanceof HTMLEMenuItemElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem !== null) {
                if (nearestItem.type == "submenu" &&
                    !nearestItem.expanded) {
                    toggleAnimations.get(nearestItem)?.cancel();
                }
                const isTargetClosestMenu = event.composedPath().find(target_i => target_i instanceof HTMLEMenuElement) == this;
                if (isTargetClosestMenu) {
                    const { activeItem } = this;
                    if (activeItem?.type == "submenu" &&
                        activeItem.expanded) {
                        let toggleAnimation = toggleAnimations.get(activeItem);
                        if (toggleAnimation) {
                            toggleAnimation.cancel();
                        }
                        toggleAnimation = activeItem.animate(null, {
                            duration: HIDE_DELAY_MS
                        });
                        toggleAnimations.set(activeItem, toggleAnimation);
                        const { finished } = toggleAnimation;
                        finished
                            .then(() => {
                            activeItem.collapse();
                        })
                            .catch(() => undefined)
                            .finally(() => {
                            toggleAnimations.delete(activeItem);
                        });
                    }
                    const { left, right, top, bottom } = (() => {
                        const parentItem = this.closest("e-menuitem");
                        if (parentItem && !parentItem.expanded) {
                            parentItem.expand();
                            const menuRect = this.getBoundingClientRect();
                            parentItem.collapse();
                            return menuRect;
                        }
                        else {
                            return this.getBoundingClientRect();
                        }
                    })();
                    const { clientX, clientY } = event;
                    const intersectsWithMouse = !(left > clientX || right < clientX || top > clientY || bottom < clientY);
                    const containsRelatedTarget = this.contains(relatedTarget);
                    if (intersectsWithMouse && containsRelatedTarget) {
                        if (relatedTarget instanceof HTMLEMenuElement && relatedTarget !== this) {
                            relatedTarget.focus({ preventScroll: true });
                        }
                        else {
                            this.focus({ preventScroll: true });
                            this.#setActiveItem(null);
                        }
                    }
                    if (!intersectsWithMouse) {
                        this.focus({ preventScroll: true });
                        this.#setActiveItem(null);
                    }
                }
            }
        }
    }
    #handleMouseOverEvent(event) {
        const { target } = event;
        if (target instanceof HTMLEMenuItemElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem !== null) {
                if (nearestItem.type === "submenu" && nearestItem.expanded) {
                    toggleAnimations.get(nearestItem)?.cancel();
                }
                const isTargetClosestMenu = event.composedPath().find(target_i => target_i instanceof HTMLEMenuElement) == this;
                if (isTargetClosestMenu) {
                    const { activeItem } = this;
                    if (activeItem?.type === "submenu" &&
                        activeItem.expanded &&
                        !activeItem.contains(target)) {
                        let toggleAnimation = toggleAnimations.get(activeItem);
                        if (toggleAnimation) {
                            toggleAnimation.cancel();
                        }
                        toggleAnimation = activeItem.animate(null, {
                            duration: SHOW_DELAY_MS
                        });
                        toggleAnimations.set(activeItem, toggleAnimation);
                        const { finished } = toggleAnimation;
                        finished
                            .then(() => {
                            activeItem.collapse();
                        })
                            .catch(() => undefined)
                            .finally(() => {
                            toggleAnimations.delete(activeItem);
                        });
                    }
                    this.#setActiveItem(nearestItem);
                    nearestItem.focus({ preventScroll: true });
                    if (nearestItem.type === "submenu") {
                        if (!nearestItem.expanded) {
                            let toggleAnimation = toggleAnimations.get(nearestItem);
                            if (toggleAnimation) {
                                toggleAnimation.cancel();
                            }
                            toggleAnimation = nearestItem.animate(null, {
                                duration: HIDE_DELAY_MS
                            });
                            toggleAnimations.set(nearestItem, toggleAnimation);
                            const { finished } = toggleAnimation;
                            finished
                                .then(() => {
                                const { activeItem } = this;
                                this.#collapseSubmenus();
                                if (activeItem) {
                                    toggleAnimations.get(activeItem)?.cancel();
                                    activeItem.expand();
                                    activeItem.menu?.focus({ preventScroll: true });
                                }
                            })
                                .catch(() => undefined)
                                .finally(() => {
                                toggleAnimations.delete(nearestItem);
                            });
                        }
                        else {
                            nearestItem.menu?.focus({ preventScroll: true });
                        }
                    }
                }
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuElementBase.prototype, "contextual", void 0);
HTMLEMenuElementBase = HTMLEMenuElementBase_1 = __decorate([
    CustomElement({
        name: "e-menu"
    })
], HTMLEMenuElementBase);
var HTMLEMenuElement = HTMLEMenuElementBase;
var EMenu = constructor(HTMLEMenuElement.prototype, (init) => {
    const { name, children } = init;
    return element("e-menu", {
        attributes: {
            name: name,
            tabindex: -1,
        },
        children: children
    });
});
//# sourceMappingURL=Menu.js.map