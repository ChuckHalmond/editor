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
var _HTMLEToolBarElementBase_instances, _HTMLEToolBarElementBase_walker, _HTMLEToolBarElementBase_nodeFilter, _HTMLEToolBarElementBase_lastItem, _HTMLEToolBarElementBase_previousItem, _HTMLEToolBarElementBase_nextItem, _HTMLEToolBarElementBase_setActiveItem, _HTMLEToolBarElementBase_handleClickEvent, _HTMLEToolBarElementBase_handleContextMenuEvent, _HTMLEToolBarElementBase_handleDblClickEvent, _HTMLEToolBarElementBase_handleFocusEvent, _HTMLEToolBarElementBase_handleFocusInEvent, _HTMLEToolBarElementBase_handleFocusOutEvent, _HTMLEToolBarElementBase_handleMouseDownEvent, _HTMLEToolBarElementBase_handleKeyDownEvent;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
import { HTMLEToolBarItemGroupElement } from "./ToolBarItemGroup";
export { HTMLEToolBarElement };
var shadowTemplate;
var style;
var wasExpandedOnMouseDown;
let HTMLEToolBarElementBase = class HTMLEToolBarElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEToolBarElementBase_instances.add(this);
        _HTMLEToolBarElementBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEToolBarElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_nodeFilter).bind(this)), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleClickEvent).bind(this));
        this.addEventListener("contextmenu", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleContextMenuEvent).bind(this));
        this.addEventListener("dblclick", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleDblClickEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("mousedown", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleMouseDownEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_handleKeyDownEvent).bind(this));
    }
    get activeItem() {
        return this.querySelector("e-toolbaritem[active]");
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-toolbaritemgroup) > e-toolbaritem"));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    firstItem() {
        const walker = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_walker, "f");
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
};
_HTMLEToolBarElementBase_walker = new WeakMap(), _HTMLEToolBarElementBase_instances = new WeakSet(), _HTMLEToolBarElementBase_nodeFilter = function _HTMLEToolBarElementBase_nodeFilter(node) {
    if (node instanceof HTMLEToolBarItemElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEToolBarItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEToolBarElementBase_lastItem = function _HTMLEToolBarElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.lastChild();
}, _HTMLEToolBarElementBase_previousItem = function _HTMLEToolBarElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_walker, "f");
    walker.currentNode = item;
    const previousItem = walker.previousSibling();
    return previousItem;
}, _HTMLEToolBarElementBase_nextItem = function _HTMLEToolBarElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_walker, "f");
    walker.currentNode = item;
    return walker.nextSibling();
}, _HTMLEToolBarElementBase_setActiveItem = function _HTMLEToolBarElementBase_setActiveItem(item) {
    const { activeItem } = this;
    if (activeItem !== null && activeItem !== item) {
        activeItem.active = false;
    }
    if (item !== null) {
        item.active = true;
    }
}, _HTMLEToolBarElementBase_handleClickEvent = function _HTMLEToolBarElementBase_handleClickEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-toolbaritem");
    if (targetItem) {
        const { type, pressed } = targetItem;
        switch (type) {
            case "checkbox": {
                targetItem.pressed = !pressed;
                break;
            }
            case "radio": {
                targetItem.pressed = true;
                break;
            }
            case "menubutton": {
                const { menubutton } = targetItem;
                if (menubutton && !menubutton.contains(target)) {
                    const force = !wasExpandedOnMouseDown.get(targetItem) ?? true;
                    menubutton.toggle(force);
                    if (force) {
                        menubutton.firstItem?.focus({ preventScroll: true });
                    }
                }
                break;
            }
            case "select": {
                const { select } = targetItem;
                if (select && !select.contains(target)) {
                    const force = !wasExpandedOnMouseDown.get(targetItem) ?? true;
                    select.toggle(force);
                }
                break;
            }
        }
    }
    event.stopPropagation();
}, _HTMLEToolBarElementBase_handleContextMenuEvent = function _HTMLEToolBarElementBase_handleContextMenuEvent(event) {
    event.stopPropagation();
}, _HTMLEToolBarElementBase_handleDblClickEvent = function _HTMLEToolBarElementBase_handleDblClickEvent(event) {
    event.stopPropagation();
}, _HTMLEToolBarElementBase_handleFocusEvent = function _HTMLEToolBarElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { activeItem } = this;
    if (!this.contains(relatedTarget)) {
        (activeItem ?? this.firstItem())?.focus();
    }
}, _HTMLEToolBarElementBase_handleFocusInEvent = function _HTMLEToolBarElementBase_handleFocusInEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-toolbaritem");
    if (targetItem) {
        __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_setActiveItem).call(this, targetItem);
        this.tabIndex = -1;
    }
}, _HTMLEToolBarElementBase_handleFocusOutEvent = function _HTMLEToolBarElementBase_handleFocusOutEvent(event) {
    const { relatedTarget } = event;
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin) {
        this.tabIndex = 0;
    }
}, _HTMLEToolBarElementBase_handleMouseDownEvent = function _HTMLEToolBarElementBase_handleMouseDownEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-toolbaritem");
    if (targetItem) {
        const { type } = targetItem;
        switch (type) {
            case "menubutton": {
                const { menubutton } = targetItem;
                if (menubutton && !menubutton.contains(target)) {
                    wasExpandedOnMouseDown.set(targetItem, menubutton.expanded);
                }
                break;
            }
            case "select": {
                const { select } = targetItem;
                if (select && !select.contains(target)) {
                    wasExpandedOnMouseDown.set(targetItem, select.expanded);
                }
                break;
            }
        }
    }
}, _HTMLEToolBarElementBase_handleKeyDownEvent = function _HTMLEToolBarElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { activeItem } = this;
    switch (key) {
        case "Enter": {
            if (activeItem) {
                const { type } = activeItem;
                switch (type) {
                    case "menubutton": {
                        const { menubutton } = activeItem;
                        if (menubutton) {
                            menubutton.expand();
                            menubutton.firstItem?.focus({ preventScroll: true });
                        }
                        break;
                    }
                    case "select": {
                        const { select } = activeItem;
                        if (select) {
                            select.expand();
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
        case "ArrowLeft": {
            if (activeItem) {
                const previousItem = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_previousItem).call(this, activeItem);
                if (previousItem) {
                    previousItem.focus({ preventScroll: true });
                }
            }
            else {
                const firstItem = this.firstItem();
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
            break;
        }
        case "ArrowRight": {
            if (activeItem) {
                const nextItem = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_nextItem).call(this, activeItem);
                if (nextItem) {
                    nextItem.focus({ preventScroll: true });
                }
            }
            else {
                const lastItem = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_lastItem).call(this);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
            break;
        }
        case "ArrowDown": {
            if (activeItem) {
                const { type } = activeItem;
                switch (type) {
                    case "select": {
                        activeItem.select?.expand();
                        event.stopPropagation();
                        break;
                    }
                }
            }
            break;
        }
        case "Home": {
            const firstItem = this.firstItem();
            if (firstItem) {
                firstItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "End": {
            const lastItem = __classPrivateFieldGet(this, _HTMLEToolBarElementBase_instances, "m", _HTMLEToolBarElementBase_lastItem).call(this);
            if (lastItem) {
                lastItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    wasExpandedOnMouseDown = new WeakMap();
    style = /*css*/ `
            :host {
                display: flex;
                flex-direction: row;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarElementBase.prototype, "orientation", void 0);
HTMLEToolBarElementBase = __decorate([
    CustomElement({
        name: "e-toolbar"
    })
], HTMLEToolBarElementBase);
var HTMLEToolBarElement = HTMLEToolBarElementBase;
//# sourceMappingURL=ToolBar.js.map