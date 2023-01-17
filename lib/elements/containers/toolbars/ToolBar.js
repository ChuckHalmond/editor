var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
import { HTMLEToolBarItemGroupElement } from "./ToolBarItemGroup";
import "./ToolBarItem";
import "./ToolBarItemGroup";
export { HTMLEToolBarElement };
var shadowTemplate;
var style;
var wasExpandedOnMouseDown;
let HTMLEToolBarElementBase = class HTMLEToolBarElementBase extends HTMLElement {
    get activeItem() {
        return this.querySelector("e-toolbaritem[active]");
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-toolbaritemgroup) > e-toolbaritem"));
    }
    #walker;
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("slot"));
        wasExpandedOnMouseDown = new WeakMap();
        style = /*css*/ `
            :host {
                display: flex;
                flex-direction: row;
            }
        `;
    }
    constructor() {
        super();
        this.#walker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this));
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        this.addEventListener("dblclick", this.#handleDblClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    #nodeFilter(node) {
        if (node instanceof HTMLEToolBarItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEToolBarItemGroupElement) {
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
        const previousItem = walker.previousSibling();
        return previousItem;
    }
    #nextItem(item) {
        const walker = this.#walker;
        walker.currentNode = item;
        return walker.nextSibling();
    }
    #setActiveItem(item) {
        const { activeItem } = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null) {
            item.active = true;
        }
    }
    #handleClickEvent(event) {
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
                        const expand = !wasExpandedOnMouseDown.get(targetItem);
                        menubutton.toggle(expand);
                        if (expand) {
                            menubutton.firstItem?.focus({ preventScroll: true });
                        }
                    }
                    break;
                }
                case "select": {
                    const { select } = targetItem;
                    if (select && !select.contains(target)) {
                        const expand = !wasExpandedOnMouseDown.get(targetItem);
                        select.toggle(expand);
                    }
                    break;
                }
            }
        }
        event.stopPropagation();
    }
    #handleContextMenuEvent(event) {
        event.stopPropagation();
    }
    #handleDblClickEvent(event) {
        event.stopPropagation();
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
        const targetItem = target.closest("e-toolbaritem");
        if (targetItem) {
            this.#setActiveItem(targetItem);
            this.tabIndex = -1;
        }
    }
    #handleFocusOutEvent(event) {
        const { relatedTarget } = event;
        const lostFocusWithin = !this.contains(relatedTarget);
        if (lostFocusWithin) {
            this.tabIndex = 0;
        }
    }
    #handleMouseDownEvent(event) {
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
    }
    #handleKeyDownEvent(event) {
        const { key } = event;
        const { activeItem } = this;
        switch (key) {
            case "Enter":
            case " ": {
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
                    const previousItem = this.#previousItem(activeItem);
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
                    const nextItem = this.#nextItem(activeItem);
                    if (nextItem) {
                        nextItem.focus({ preventScroll: true });
                    }
                }
                else {
                    const lastItem = this.#lastItem();
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
                const lastItem = this.#lastItem();
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
        }
    }
};
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