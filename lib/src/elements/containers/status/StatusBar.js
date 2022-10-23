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
var _HTMLEStatusBarElementBase_instances, _HTMLEStatusBarElementBase_walker, _HTMLEStatusBarElementBase_nodeFilter, _HTMLEStatusBarElementBase_lastItem, _HTMLEStatusBarElementBase_previousItem, _HTMLEStatusBarElementBase_nextItem, _HTMLEStatusBarElementBase_setActiveItem, _HTMLEStatusBarElementBase_handleContextMenuEvent, _HTMLEStatusBarElementBase_handleDblClickEvent, _HTMLEStatusBarElementBase_handleFocusEvent, _HTMLEStatusBarElementBase_handleFocusInEvent, _HTMLEStatusBarElementBase_handleFocusOutEvent, _HTMLEStatusBarElementBase_handleKeyDownEvent;
import { CustomElement, element } from "../../Element";
import { HTMLEStatusItemElement } from "./StatusItem";
import { HTMLEStatusItemGroupElement } from "./StatusItemGroup";
export { HTMLEStatusBarElement };
var shadowTemplate;
var style;
let HTMLEStatusBarElementBase = class HTMLEStatusBarElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEStatusBarElementBase_instances.add(this);
        _HTMLEStatusBarElementBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEStatusBarElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_nodeFilter).bind(this)), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("contextmenu", __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_handleContextMenuEvent).bind(this));
        this.addEventListener("dblclick", __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_handleDblClickEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_handleKeyDownEvent).bind(this));
    }
    get activeItem() {
        return this.querySelector("e-statusitem[active]");
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-statusitemgroup) > e-statusitem"));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    firstItem() {
        const walker = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_walker, "f");
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
};
_HTMLEStatusBarElementBase_walker = new WeakMap(), _HTMLEStatusBarElementBase_instances = new WeakSet(), _HTMLEStatusBarElementBase_nodeFilter = function _HTMLEStatusBarElementBase_nodeFilter(node) {
    if (node instanceof HTMLEStatusItemElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEStatusItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEStatusBarElementBase_lastItem = function _HTMLEStatusBarElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.lastChild();
}, _HTMLEStatusBarElementBase_previousItem = function _HTMLEStatusBarElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_walker, "f");
    walker.currentNode = item;
    const previousItem = walker.previousSibling();
    return previousItem;
}, _HTMLEStatusBarElementBase_nextItem = function _HTMLEStatusBarElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_walker, "f");
    walker.currentNode = item;
    return walker.nextSibling();
}, _HTMLEStatusBarElementBase_setActiveItem = function _HTMLEStatusBarElementBase_setActiveItem(item) {
    const { activeItem } = this;
    if (activeItem !== null && activeItem !== item) {
        activeItem.active = false;
    }
    if (item !== null) {
        item.active = true;
    }
}, _HTMLEStatusBarElementBase_handleContextMenuEvent = function _HTMLEStatusBarElementBase_handleContextMenuEvent(event) {
    event.stopPropagation();
}, _HTMLEStatusBarElementBase_handleDblClickEvent = function _HTMLEStatusBarElementBase_handleDblClickEvent(event) {
    event.stopPropagation();
}, _HTMLEStatusBarElementBase_handleFocusEvent = function _HTMLEStatusBarElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { activeItem } = this;
    if (!this.contains(relatedTarget)) {
        (activeItem ?? this.firstItem())?.focus();
    }
}, _HTMLEStatusBarElementBase_handleFocusInEvent = function _HTMLEStatusBarElementBase_handleFocusInEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-statusitem");
    if (targetItem) {
        __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_setActiveItem).call(this, targetItem);
        this.tabIndex = -1;
    }
}, _HTMLEStatusBarElementBase_handleFocusOutEvent = function _HTMLEStatusBarElementBase_handleFocusOutEvent(event) {
    const { relatedTarget } = event;
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin) {
        this.tabIndex = 0;
    }
}, _HTMLEStatusBarElementBase_handleKeyDownEvent = function _HTMLEStatusBarElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { activeItem } = this;
    switch (key) {
        case "Enter": {
            if (activeItem) {
                activeItem.click();
                event.stopPropagation();
            }
            break;
        }
        case "ArrowLeft": {
            if (activeItem) {
                const previousItem = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_previousItem).call(this, activeItem);
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
                const nextItem = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_nextItem).call(this, activeItem);
                if (nextItem) {
                    nextItem.focus({ preventScroll: true });
                }
            }
            else {
                const lastItem = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_lastItem).call(this);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
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
            const lastItem = __classPrivateFieldGet(this, _HTMLEStatusBarElementBase_instances, "m", _HTMLEStatusBarElementBase_lastItem).call(this);
            if (lastItem) {
                lastItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "Escape": {
            this.focus({ preventScroll: true });
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
                display: flex;
                flex-direction: row;
            }

            :host(:focus) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }

            ::slotted(e-statusitem:not(:first-child)) {
                margin-left: 4px;
            }
        `;
})();
HTMLEStatusBarElementBase = __decorate([
    CustomElement({
        name: "e-statusbar"
    })
], HTMLEStatusBarElementBase);
var HTMLEStatusBarElement = HTMLEStatusBarElementBase;
//# sourceMappingURL=StatusBar.js.map