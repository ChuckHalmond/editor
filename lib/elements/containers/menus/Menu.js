var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTMLEMenuElementBase_instances, _HTMLEMenuElementBase_walker, _HTMLEMenuElementBase_activeIndex, _HTMLEMenuElementBase_collapseSubmenus, _HTMLEMenuElementBase_nearestItem, _HTMLEMenuElementBase_walkerNodeFilter, _HTMLEMenuElementBase_lastItem, _HTMLEMenuElementBase_previousItem, _HTMLEMenuElementBase_nextItem, _HTMLEMenuElementBase_firstChildItem, _HTMLEMenuElementBase_setActiveItem, _HTMLEMenuElementBase_handleClickEvent, _HTMLEMenuElementBase_handleFocusInEvent, _HTMLEMenuElementBase_handleFocusOutEvent, _HTMLEMenuElementBase_handleKeyDownEvent, _HTMLEMenuElementBase_handleMouseOutEvent, _HTMLEMenuElementBase_handleMouseOverEvent;
var HTMLEMenuElementBase_1;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
import "./MenuItem";
import "./MenuItemGroup";
export { HTMLEMenuElement };
export { EMenu };
var shadowTemplate;
var style;
var toggleAnimations;
var HIDE_DELAY_MS = 200;
var SHOW_DELAY_MS = 400;
let HTMLEMenuElementBase = HTMLEMenuElementBase_1 = class HTMLEMenuElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEMenuElementBase_instances.add(this);
        _HTMLEMenuElementBase_walker.set(this, void 0);
        _HTMLEMenuElementBase_activeIndex.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEMenuElementBase_activeIndex, -1, "f");
        __classPrivateFieldSet(this, _HTMLEMenuElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_walkerNodeFilter).bind(this)), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_handleClickEvent).bind(this));
        this.addEventListener("mouseover", __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_handleMouseOverEvent).bind(this));
        this.addEventListener("mouseout", __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_handleMouseOutEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_handleKeyDownEvent).bind(this));
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem"));
    }
    get activeIndex() {
        return __classPrivateFieldGet(this, _HTMLEMenuElementBase_activeIndex, "f");
    }
    get activeItem() {
        const { activeIndex } = this;
        return (this.querySelector(":is(:scope, :scope > e-menuitemgroup) > e-menuitem:focus-within") ?? activeIndex > -1) ? this.items()[activeIndex] ?? null : null;
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
    firstItem() {
        const walker = __classPrivateFieldGet(this, _HTMLEMenuElementBase_walker, "f");
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
};
_HTMLEMenuElementBase_walker = new WeakMap(), _HTMLEMenuElementBase_activeIndex = new WeakMap(), _HTMLEMenuElementBase_instances = new WeakSet(), _HTMLEMenuElementBase_collapseSubmenus = function _HTMLEMenuElementBase_collapseSubmenus() {
    this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem[expanded]")
        .forEach((item_i) => {
        item_i.collapse();
    });
}, _HTMLEMenuElementBase_nearestItem = function _HTMLEMenuElementBase_nearestItem(target) {
    return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem")).find(item_i => item_i.contains(target)) ?? null;
}, _HTMLEMenuElementBase_walkerNodeFilter = function _HTMLEMenuElementBase_walkerNodeFilter(node) {
    if (node instanceof HTMLEMenuItemElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEMenuItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEMenuElementBase_lastItem = function _HTMLEMenuElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLEMenuElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.lastChild();
}, _HTMLEMenuElementBase_previousItem = function _HTMLEMenuElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEMenuElementBase_walker, "f");
    walker.currentNode = item;
    return walker.previousNode();
}, _HTMLEMenuElementBase_nextItem = function _HTMLEMenuElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEMenuElementBase_walker, "f");
    walker.currentNode = item;
    return walker.nextNode();
}, _HTMLEMenuElementBase_firstChildItem = function _HTMLEMenuElementBase_firstChildItem(item) {
    const { menu } = item;
    return menu instanceof HTMLEMenuElementBase_1 ?
        menu.firstItem() :
        null;
}, _HTMLEMenuElementBase_setActiveItem = function _HTMLEMenuElementBase_setActiveItem(item) {
    if (item !== null) {
        __classPrivateFieldSet(this, _HTMLEMenuElementBase_activeIndex, this.items().indexOf(item), "f");
    }
}, _HTMLEMenuElementBase_handleClickEvent = function _HTMLEMenuElementBase_handleClickEvent(event) {
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
}, _HTMLEMenuElementBase_handleFocusInEvent = function _HTMLEMenuElementBase_handleFocusInEvent(event) {
    const { target } = event;
    if (target instanceof HTMLEMenuItemElement) {
        const nearestItem = __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_nearestItem).call(this, target);
        if (nearestItem) {
            __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_setActiveItem).call(this, nearestItem);
        }
    }
}, _HTMLEMenuElementBase_handleFocusOutEvent = function _HTMLEMenuElementBase_handleFocusOutEvent(event) {
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
            __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_setActiveItem).call(this, null);
        }
    }
}, _HTMLEMenuElementBase_handleKeyDownEvent = function _HTMLEMenuElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { activeItem } = this;
    switch (key) {
        case "ArrowUp": {
            const previousItem = activeItem ?
                __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_previousItem).call(this, activeItem) ?? __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_lastItem).call(this) :
                this.firstItem();
            previousItem?.focus({ preventScroll: true });
            event.stopPropagation();
            break;
        }
        case "ArrowDown": {
            const nextItem = activeItem ?
                __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_nextItem).call(this, activeItem) ?? this.firstItem() :
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
            const lastItem = __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_lastItem).call(this);
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
                            const firstChildItem = __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_firstChildItem).call(this, activeItem);
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
                            const firstChildItem = __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_firstChildItem).call(this, activeItem);
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
}, _HTMLEMenuElementBase_handleMouseOutEvent = function _HTMLEMenuElementBase_handleMouseOutEvent(event) {
    const { target, relatedTarget } = event;
    if (target instanceof HTMLEMenuItemElement) {
        const nearestItem = __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_nearestItem).call(this, target);
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
                        __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_setActiveItem).call(this, null);
                    }
                }
                if (!intersectsWithMouse) {
                    this.focus({ preventScroll: true });
                    __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_setActiveItem).call(this, null);
                }
            }
        }
    }
}, _HTMLEMenuElementBase_handleMouseOverEvent = function _HTMLEMenuElementBase_handleMouseOverEvent(event) {
    const { target } = event;
    if (target instanceof HTMLEMenuItemElement) {
        const nearestItem = __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_nearestItem).call(this, target);
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
                __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_setActiveItem).call(this, nearestItem);
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
                            __classPrivateFieldGet(this, _HTMLEMenuElementBase_instances, "m", _HTMLEMenuElementBase_collapseSubmenus).call(this);
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
};
(() => {
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
})();
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
var EMenu = Object.assign(function (init) {
    const { name, children } = init;
    return element("e-menu", {
        attributes: {
            name: name,
            tabindex: -1,
        },
        children: children
    });
}, {
    prototype: HTMLEMenuElement.prototype,
});
//# sourceMappingURL=Menu.js.map