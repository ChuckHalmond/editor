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
var _HTMLETabListElementBase_instances, _HTMLETabListElementBase_walker, _HTMLETabListElementBase_walkerNodeFilter, _HTMLETabListElementBase_lastItem, _HTMLETabListElementBase_previousItem, _HTMLETabListElementBase_nextItem, _HTMLETabListElementBase_setActiveTab, _HTMLETabListElementBase_selectTab, _HTMLETabListElementBase_handleClickEvent, _HTMLETabListElementBase_handleFocusEvent, _HTMLETabListElementBase_handleFocusInEvent, _HTMLETabListElementBase_handleFocusOutEvent, _HTMLETabListElementBase_handleKeyDownEvent, _HTMLETabListElementBase_handleSelectEvent;
import { CustomElement, element } from "../../Element";
import { HTMLETabElement } from "./Tab";
export { HTMLETabListElement };
var shadowTemplate;
var style;
var SELECT_ANIMATION_DURATION = 300;
let HTMLETabListElementBase = class HTMLETabListElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLETabListElementBase_instances.add(this);
        _HTMLETabListElementBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLETabListElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_walkerNodeFilter).bind(this)), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleClickEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleKeyDownEvent).bind(this));
        this.addEventListener("select", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleSelectEvent).bind(this));
        this.addEventListener("select", __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_handleSelectEvent).bind(this));
    }
    get tabs() {
        return Array.from(this.querySelectorAll("e-tab"));
    }
    get activeTab() {
        return this.querySelector("e-tab[active]");
    }
    get selectedTab() {
        return this.querySelector("e-tab[selected]");
    }
    connectedCallback() {
        const { tabIndex, selectedTab } = this;
        this.tabIndex = tabIndex;
        customElements.upgrade(this);
        const tabToSelect = selectedTab ?? this.firstItem();
        if (tabToSelect) {
            __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_selectTab).call(this, tabToSelect);
            setTimeout(() => {
                const { width: tabWidth, height: tabHeight } = tabToSelect.getBoundingClientRect();
                const { offsetLeft } = tabToSelect;
                this.animate([{
                        width: `${tabWidth}px`,
                        left: `${offsetLeft}px`,
                        top: `${tabHeight}px`
                    }], {
                    duration: 0,
                    fill: "forwards",
                    easing: "ease-in-out",
                    pseudoElement: "::after"
                });
            });
        }
    }
    firstItem() {
        const walker = __classPrivateFieldGet(this, _HTMLETabListElementBase_walker, "f");
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
};
_HTMLETabListElementBase_walker = new WeakMap(), _HTMLETabListElementBase_instances = new WeakSet(), _HTMLETabListElementBase_walkerNodeFilter = function _HTMLETabListElementBase_walkerNodeFilter(node) {
    if (node instanceof HTMLETabElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLETabListElementBase_lastItem = function _HTMLETabListElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLETabListElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.lastChild();
}, _HTMLETabListElementBase_previousItem = function _HTMLETabListElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLETabListElementBase_walker, "f");
    walker.currentNode = item;
    return walker.previousNode();
}, _HTMLETabListElementBase_nextItem = function _HTMLETabListElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLETabListElementBase_walker, "f");
    walker.currentNode = item;
    return walker.nextNode();
}, _HTMLETabListElementBase_setActiveTab = function _HTMLETabListElementBase_setActiveTab(item) {
    const { activeTab } = this;
    if (activeTab !== null && activeTab !== item) {
        activeTab.active = false;
    }
    if (item !== null) {
        item.active = true;
    }
}, _HTMLETabListElementBase_selectTab = function _HTMLETabListElementBase_selectTab(tab) {
    const { selectedTab } = this;
    if (tab !== selectedTab) {
        tab.selected = true;
    }
}, _HTMLETabListElementBase_handleClickEvent = function _HTMLETabListElementBase_handleClickEvent(event) {
    const { target } = event;
    const targetTab = target.closest("e-tab");
    if (targetTab) {
        targetTab.select();
        const { width: tabWidth, height: tabHeight } = targetTab.getBoundingClientRect();
        const { offsetLeft } = targetTab;
        console.log({
            width: `${tabWidth}px`,
            left: `${offsetLeft}px`,
            top: `${tabHeight}px`
        });
        this.animate([{
                width: `${tabWidth}px`,
                left: `${offsetLeft}px`,
                top: `${tabHeight}px`
            }], {
            duration: SELECT_ANIMATION_DURATION,
            fill: "forwards",
            easing: "ease-in-out",
            pseudoElement: "::after"
        });
    }
}, _HTMLETabListElementBase_handleFocusEvent = function _HTMLETabListElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { selectedTab } = this;
    if (!this.contains(relatedTarget)) {
        (selectedTab ?? this.firstItem())?.focus();
    }
}, _HTMLETabListElementBase_handleFocusInEvent = function _HTMLETabListElementBase_handleFocusInEvent(event) {
    const { target } = event;
    const targetTab = target.closest("e-tab");
    if (targetTab) {
        __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_setActiveTab).call(this, targetTab);
        this.tabIndex = -1;
    }
}, _HTMLETabListElementBase_handleFocusOutEvent = function _HTMLETabListElementBase_handleFocusOutEvent(event) {
    const { relatedTarget } = event;
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin) {
        this.tabIndex = 0;
    }
}, _HTMLETabListElementBase_handleKeyDownEvent = function _HTMLETabListElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { activeTab } = this;
    switch (key) {
        case "ArrowLeft": {
            const previousTab = activeTab ?
                __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_previousItem).call(this, activeTab) ?? __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_lastItem).call(this) :
                this.firstItem();
            previousTab?.focus({ preventScroll: true });
            event.stopPropagation();
            break;
        }
        case "ArrowRight": {
            const nextTab = activeTab ?
                __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_nextItem).call(this, activeTab) ?? this.firstItem() :
                __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_lastItem).call(this);
            nextTab?.focus({ preventScroll: true });
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
            const lastItem = __classPrivateFieldGet(this, _HTMLETabListElementBase_instances, "m", _HTMLETabListElementBase_lastItem).call(this);
            if (lastItem) {
                lastItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "Enter": {
            activeTab?.click();
            event.stopPropagation();
            break;
        }
    }
}, _HTMLETabListElementBase_handleSelectEvent = function _HTMLETabListElementBase_handleSelectEvent(event) {
    const { target } = event;
    const targetTab = target;
    if (targetTab.selected) {
        const { tabs } = this;
        tabs.forEach((tab_i) => {
            if (tab_i !== targetTab) {
                tab_i.selected = false;
                const { panel } = tab_i;
                if (panel) {
                    panel.hidden = true;
                }
            }
        });
        const { panel } = targetTab;
        if (panel) {
            panel.hidden = false;
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
            }

            :host::after {
                position: absolute;
                display: inline-block;
                content: " ";
                transform: translateY(-100%);
                box-sizing: border-box;
                border-top: 2px solid var(--focused-item-outline-color);
            }
        `;
})();
HTMLETabListElementBase = __decorate([
    CustomElement({
        name: "e-tablist"
    })
], HTMLETabListElementBase);
var HTMLETabListElement = HTMLETabListElementBase;
//# sourceMappingURL=TabList.js.map