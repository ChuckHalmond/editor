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
var _HTMLEMenuButtonElementBase_instances, _HTMLEMenuButtonElementBase_positionMenu, _HTMLEMenuButtonElementBase_handleClickEvent, _HTMLEMenuButtonElementBase_handleFocusOutEvent, _HTMLEMenuButtonElementBase_handleKeyDownEvent;
import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_ARROW_RIGHT_IMAGE } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import "./Menu";
import "./MenuItem";
import "./MenuItemGroup";
export { HTMLEMenuButtonElement };
export { EMenuButton };
var shadowTemplate;
var style;
let HTMLEMenuButtonElementBase = class HTMLEMenuButtonElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEMenuButtonElementBase_instances.add(this);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEMenuButtonElementBase_instances, "m", _HTMLEMenuButtonElementBase_handleKeyDownEvent).bind(this));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLEMenuButtonElementBase_instances, "m", _HTMLEMenuButtonElementBase_handleClickEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLEMenuButtonElementBase_instances, "m", _HTMLEMenuButtonElementBase_handleFocusOutEvent).bind(this));
    }
    connectedCallback() {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
    }
    toggle(force) {
        const { expanded } = this;
        const expand = force ?? !expanded;
        expand ? this.expand() : this.collapse();
    }
    expand() {
        const { expanded } = this;
        if (!expanded) {
            this.expanded = true;
            __classPrivateFieldGet(this, _HTMLEMenuButtonElementBase_instances, "m", _HTMLEMenuButtonElementBase_positionMenu).call(this);
        }
    }
    collapse() {
        const { expanded } = this;
        if (expanded) {
            this.expanded = false;
        }
    }
};
_HTMLEMenuButtonElementBase_instances = new WeakSet(), _HTMLEMenuButtonElementBase_positionMenu = function _HTMLEMenuButtonElementBase_positionMenu() {
    const { menu } = this;
    if (menu !== null) {
        const { width, height } = this.getBoundingClientRect();
        const { style: menuStyle } = menu;
        const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
        const { clientWidth, clientHeight } = document.body;
        const { offsetLeft, offsetTop } = this;
        const overflowX = offsetLeft + width + menuWidth - clientWidth;
        const overflowY = offsetTop + menuHeight - clientHeight;
        menuStyle.setProperty("left", `${overflowX > 0 ?
            width - menuWidth :
            0}px`);
        menuStyle.setProperty("top", `${overflowY > 0 ?
            -menuHeight :
            height}px`);
    }
}, _HTMLEMenuButtonElementBase_handleClickEvent = function _HTMLEMenuButtonElementBase_handleClickEvent(event) {
    const { target } = event;
    const { menu } = this;
    if (menu && !menu.contains(target)) {
        this.toggle();
        const { expanded } = this;
        if (expanded) {
            menu?.focus({ preventScroll: true });
        }
    }
}, _HTMLEMenuButtonElementBase_handleFocusOutEvent = function _HTMLEMenuButtonElementBase_handleFocusOutEvent(event) {
    const { relatedTarget } = event;
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin) {
        this.collapse();
    }
}, _HTMLEMenuButtonElementBase_handleKeyDownEvent = function _HTMLEMenuButtonElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { expanded } = this;
    switch (key) {
        case "ArrowDown":
        case "Enter":
            if (!expanded) {
                this.expand();
                this.firstItem?.focus({ preventScroll: true });
                event.stopPropagation();
            }
            break;
        case "Escape":
            if (expanded) {
                this.collapse();
            }
            this.focus({ preventScroll: true });
            event.stopPropagation();
            break;
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"), element("span", {
        attributes: {
            part: "arrow"
        }
    }), element("slot", {
        attributes: {
            name: "menu"
        }
    }));
    style = /*css*/ `
            :host {
                position: relative;
                display: inline-block;
                padding: 2px;
                line-height: 18px;
                user-select: none;
                white-space: nowrap;
                cursor: pointer;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host(:focus-within:not(:focus)) {
                background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
            }
            
            :host(:hover:not(:focus-within)) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([disabled]) {
                color: lightgray;
            }
            
            ::slotted([slot="menu"]) {
                z-index: 1;
                position: absolute;
                color: initial;
            }
            
            :host(:not([expanded])) ::slotted([slot="menu"]) {
                opacity: 0;
                pointer-events: none;
            }
            
            [part="arrow"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px 4px 1px 1px;
                pointer-events: none;
            }
            
            [part="arrow"]::after {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                
                -webkit-mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                background-color: black;
            }
        `;
})();
__decorate([
    QueryProperty({ selector: ":scope > e-menu[slot=menu]" })
], HTMLEMenuButtonElementBase.prototype, "menu", void 0);
__decorate([
    QueryProperty({ selector: ":scope > e-menu[slot=menu] e-menuitem" })
], HTMLEMenuButtonElementBase.prototype, "firstItem", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuButtonElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuButtonElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuButtonElementBase.prototype, "expanded", void 0);
HTMLEMenuButtonElementBase = __decorate([
    CustomElement({
        name: "e-menubutton"
    })
], HTMLEMenuButtonElementBase);
var HTMLEMenuButtonElement = HTMLEMenuButtonElementBase;
var EMenuButton = Object.assign(function (init) {
    const { menu } = init;
    menu.slot = "menu";
    return element("e-menubutton", {
        attributes: {
            tabindex: -1
        },
        children: [menu]
    });
}, {
    prototype: HTMLEMenuButtonElement.prototype,
});
//# sourceMappingURL=MenuButton.js.map