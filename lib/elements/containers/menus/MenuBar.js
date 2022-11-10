var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HTMLEMenuBarElementBase_instances, _HTMLEMenuBarElementBase_activeIndex, _HTMLEMenuBarElementBase_walker, _HTMLEMenuBarElementBase_walkerNodeFilter, _HTMLEMenuBarElementBase_lastItem, _HTMLEMenuBarElementBase_previousItem, _HTMLEMenuBarElementBase_nextItem, _HTMLEMenuBarElementBase_firstChildItem, _HTMLEMenuBarElementBase_setActiveItem, _HTMLEMenuBarElementBase_items_get, _HTMLEMenuBarElementBase_isClosestMenu, _HTMLEMenuBarElementBase_nearestItem, _HTMLEMenuBarElementBase_handleFocusEvent, _HTMLEMenuBarElementBase_handleFocusInEvent, _HTMLEMenuBarElementBase_handleFocusOutEvent, _HTMLEMenuBarElementBase_handleMouseOverEvent, _HTMLEMenuBarElementBase_handleClickEvent, _HTMLEMenuBarElementBase_handleKeyDownEvent;
import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";
import "./Menu";
import "./MenuItem";
import "./MenuItemGroup";
export { HTMLEMenuBarElement };
var shadowTemplate;
var style;
let HTMLEMenuBarElementBase = class HTMLEMenuBarElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEMenuBarElementBase_instances.add(this);
        _HTMLEMenuBarElementBase_activeIndex.set(this, void 0);
        _HTMLEMenuBarElementBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEMenuBarElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_walkerNodeFilter).bind(this)), "f");
        __classPrivateFieldSet(this, _HTMLEMenuBarElementBase_activeIndex, -1, "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_handleClickEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("mouseover", __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_handleMouseOverEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_handleKeyDownEvent).bind(this));
    }
    connectedCallback() {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem"));
    }
    get activeIndex() {
        return __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_activeIndex, "f");
    }
    get activeItem() {
        const { activeIndex } = this;
        return (this.querySelector(":is(:scope, :scope > e-menuitemgroup) > e-menuitem:focus-within") ?? activeIndex > -1) ? this.items()[activeIndex] ?? null : null;
    }
    firstItem() {
        const walker = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_walker, "f");
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
};
_HTMLEMenuBarElementBase_activeIndex = new WeakMap(), _HTMLEMenuBarElementBase_walker = new WeakMap(), _HTMLEMenuBarElementBase_instances = new WeakSet(), _HTMLEMenuBarElementBase_walkerNodeFilter = function _HTMLEMenuBarElementBase_walkerNodeFilter(node) {
    if (node instanceof HTMLEMenuItemElement && !(node.disabled || node.hidden)) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEMenuItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEMenuBarElementBase_lastItem = function _HTMLEMenuBarElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.lastChild();
}, _HTMLEMenuBarElementBase_previousItem = function _HTMLEMenuBarElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_walker, "f");
    walker.currentNode = item;
    return walker.previousSibling();
}, _HTMLEMenuBarElementBase_nextItem = function _HTMLEMenuBarElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_walker, "f");
    walker.currentNode = item;
    return walker.nextSibling();
}, _HTMLEMenuBarElementBase_firstChildItem = function _HTMLEMenuBarElementBase_firstChildItem(item) {
    const { menu } = item;
    if (menu) {
        const walker = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_walker, "f");
        walker.currentNode = menu;
        return walker.firstChild();
    }
    return null;
}, _HTMLEMenuBarElementBase_setActiveItem = function _HTMLEMenuBarElementBase_setActiveItem(item) {
    const { activeItem, expanded } = this;
    if (activeItem !== null && activeItem !== item) {
        activeItem.collapse();
    }
    if (item !== null) {
        if (expanded) {
            item.expand();
        }
        __classPrivateFieldSet(this, _HTMLEMenuBarElementBase_activeIndex, this.items().indexOf(item), "f");
    }
    else {
        __classPrivateFieldSet(this, _HTMLEMenuBarElementBase_activeIndex, -1, "f");
    }
}, _HTMLEMenuBarElementBase_items_get = function _HTMLEMenuBarElementBase_items_get() {
    return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem"));
}, _HTMLEMenuBarElementBase_isClosestMenu = function _HTMLEMenuBarElementBase_isClosestMenu(target) {
    return target.closest(":is(e-menubar, e-menu)") == this;
}, _HTMLEMenuBarElementBase_nearestItem = function _HTMLEMenuBarElementBase_nearestItem(target) {
    return __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "a", _HTMLEMenuBarElementBase_items_get).find(item_i => item_i.contains(target)) ?? null;
}, _HTMLEMenuBarElementBase_handleFocusEvent = function _HTMLEMenuBarElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { activeItem } = this;
    if (!this.contains(relatedTarget)) {
        (activeItem ?? this.firstItem())?.focus();
    }
}, _HTMLEMenuBarElementBase_handleFocusInEvent = function _HTMLEMenuBarElementBase_handleFocusInEvent(event) {
    const { target } = event;
    if (target instanceof Element) {
        const nearestItem = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_nearestItem).call(this, target);
        __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_setActiveItem).call(this, nearestItem);
        this.tabIndex = -1;
    }
}, _HTMLEMenuBarElementBase_handleFocusOutEvent = function _HTMLEMenuBarElementBase_handleFocusOutEvent(event) {
    const { target, relatedTarget } = event;
    if (target instanceof HTMLElement) {
        const nearestItem = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_nearestItem).call(this, target);
        if (nearestItem) {
            nearestItem.collapse();
        }
    }
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin) {
        this.expanded = false;
        this.tabIndex = 0;
    }
}, _HTMLEMenuBarElementBase_handleMouseOverEvent = function _HTMLEMenuBarElementBase_handleMouseOverEvent(event) {
    const { target } = event;
    const { expanded, activeItem } = this;
    if (target instanceof HTMLEMenuItemElement) {
        const isClosestMenu = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_isClosestMenu).call(this, target);
        if (isClosestMenu && target !== activeItem && expanded) {
            const { menu } = target;
            if (menu) {
                target.expand();
                menu.focus({ preventScroll: true });
            }
        }
    }
}, _HTMLEMenuBarElementBase_handleClickEvent = function _HTMLEMenuBarElementBase_handleClickEvent(event) {
    const { target } = event;
    const { expanded, activeItem } = this;
    if (target instanceof HTMLEMenuItemElement) {
        const isClosestMenu = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_isClosestMenu).call(this, target);
        if (isClosestMenu) {
            const isExpanded = !expanded;
            this.expanded = isExpanded;
            if (isExpanded) {
                if (activeItem && !activeItem.expanded) {
                    activeItem.expand();
                }
                const { menu } = target;
                menu?.focus({ preventScroll: true });
            }
            else {
                if (activeItem) {
                    activeItem.collapse();
                    activeItem.blur();
                }
            }
        }
    }
}, _HTMLEMenuBarElementBase_handleKeyDownEvent = function _HTMLEMenuBarElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { expanded } = this;
    let { activeItem } = this;
    switch (key) {
        case "ArrowLeft": {
            const previousItem = activeItem ?
                __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_previousItem).call(this, activeItem) ?? __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_lastItem).call(this) :
                this.firstItem();
            previousItem?.focus({ preventScroll: true });
            ({ activeItem } = this);
            if (expanded && activeItem) {
                const firstChildItem = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_firstChildItem).call(this, activeItem);
                firstChildItem?.focus({ preventScroll: true });
            }
            break;
        }
        case "ArrowRight": {
            const nextItem = activeItem ?
                __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_nextItem).call(this, activeItem) ?? this.firstItem() :
                __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_lastItem).call(this);
            nextItem?.focus({ preventScroll: true });
            ({ activeItem } = this);
            if (expanded && activeItem) {
                const firstChildItem = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_firstChildItem).call(this, activeItem);
                firstChildItem?.focus({ preventScroll: true });
            }
            break;
        }
        case "Enter":
        case " ": {
            if (activeItem) {
                this.expanded = !expanded;
                if (!expanded) {
                    const firstChildItem = __classPrivateFieldGet(this, _HTMLEMenuBarElementBase_instances, "m", _HTMLEMenuBarElementBase_firstChildItem).call(this, activeItem);
                    firstChildItem?.focus({ preventScroll: true });
                }
            }
            break;
        }
        case "Escape": {
            if (expanded) {
                this.expanded = false;
                if (activeItem) {
                    activeItem.collapse();
                    activeItem.focus({ preventScroll: true });
                }
            }
            else {
                this.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                position: relative;
                display: flex;
                flex-direction: row;
                width: max-content;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuBarElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuBarElementBase.prototype, "expanded", void 0);
HTMLEMenuBarElementBase = __decorate([
    CustomElement({
        name: "e-menubar"
    })
], HTMLEMenuBarElementBase);
var HTMLEMenuBarElement = HTMLEMenuBarElementBase;
//# sourceMappingURL=MenuBar.js.map