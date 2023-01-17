var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
    #activeIndex;
    #walker;
    static {
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
    }
    constructor() {
        super();
        this.#walker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this));
        this.#activeIndex = -1;
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }
    connectedCallback() {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
    }
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
    #walkerNodeFilter(node) {
        if (node instanceof HTMLEMenuItemElement && !(node.disabled || node.hidden)) {
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
        return walker.previousSibling();
    }
    #nextItem(item) {
        const walker = this.#walker;
        walker.currentNode = item;
        return walker.nextSibling();
    }
    #firstChildItem(item) {
        const { menu } = item;
        if (menu) {
            const walker = this.#walker;
            walker.currentNode = menu;
            return walker.firstChild();
        }
        return null;
    }
    #setActiveItem(item) {
        const { activeItem, expanded } = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.collapse();
        }
        if (item !== null) {
            if (expanded) {
                item.expand();
            }
            this.#activeIndex = this.items().indexOf(item);
        }
        else {
            this.#activeIndex = -1;
        }
    }
    get #items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem"));
    }
    #isClosestMenu(target) {
        return target.closest(":is(e-menubar, e-menu)") == this;
    }
    #nearestItem(target) {
        return this.#items.find(item_i => item_i.contains(target)) ?? null;
    }
    #handleFocusEvent(event) {
        const { relatedTarget } = event;
        const { activeItem } = this;
        if (!this.contains(relatedTarget)) {
            (activeItem ?? this.firstItem())?.focus();
        }
    }
    #handleFocusInEvent(event) {
        const { target } = event;
        if (target instanceof Element) {
            const nearestItem = this.#nearestItem(target);
            this.#setActiveItem(nearestItem);
            this.tabIndex = -1;
        }
    }
    #handleFocusOutEvent(event) {
        const { target, relatedTarget } = event;
        if (target instanceof HTMLElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem) {
                nearestItem.collapse();
            }
        }
        const lostFocusWithin = !this.contains(relatedTarget);
        if (lostFocusWithin) {
            this.expanded = false;
            this.tabIndex = 0;
        }
    }
    #handleMouseOverEvent(event) {
        const { target } = event;
        const { expanded, activeItem } = this;
        if (target instanceof HTMLEMenuItemElement) {
            const isClosestMenu = this.#isClosestMenu(target);
            if (isClosestMenu && target !== activeItem && expanded) {
                const { menu } = target;
                if (menu) {
                    target.expand();
                    menu.focus({ preventScroll: true });
                }
            }
        }
    }
    #handleClickEvent(event) {
        const { target } = event;
        const { expanded, activeItem } = this;
        if (target instanceof HTMLEMenuItemElement) {
            const isClosestMenu = this.#isClosestMenu(target);
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
    }
    #handleKeyDownEvent(event) {
        const { key } = event;
        const { expanded } = this;
        let { activeItem } = this;
        switch (key) {
            case "ArrowLeft": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem() :
                    this.firstItem();
                previousItem?.focus({ preventScroll: true });
                ({ activeItem } = this);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({ preventScroll: true });
                }
                break;
            }
            case "ArrowRight": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.firstItem() :
                    this.#lastItem();
                nextItem?.focus({ preventScroll: true });
                ({ activeItem } = this);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({ preventScroll: true });
                }
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    this.expanded = !expanded;
                    if (!expanded) {
                        const firstChildItem = this.#firstChildItem(activeItem);
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
    }
};
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