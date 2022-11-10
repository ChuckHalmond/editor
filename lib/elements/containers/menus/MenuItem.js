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
var _HTMLEMenuItemElementBase_instances, _HTMLEMenuItemElementBase_positionMenu;
import { DEFAULT_THEME_CHECKED_IMAGE, DEFAULT_THEME_ACTIVATED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_ARROW_RIGHT_IMAGE } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, QueryProperty, element } from "../../Element";
export { HTMLEMenuItemElement };
export { EMenuItem };
var shadowTemplate;
var style;
let HTMLEMenuItemElementBase = class HTMLEMenuItemElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEMenuItemElementBase_instances.add(this);
        const internals = this.attachInternals();
        this.internals = internals;
        internals.role = "menuitem";
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    attributeChangedCallback(attributeName, oldValue, newValue) {
        const { internals } = this;
        switch (attributeName) {
            case "type": {
                switch (newValue) {
                    case "checkbox":
                    case "radio": {
                        internals.role = `menuitem${newValue}`;
                        break;
                    }
                    default: {
                        internals.role = "menuitem";
                        break;
                    }
                }
                break;
            }
            case "checked": {
                internals.ariaChecked = String(newValue !== null);
                break;
            }
            case "disabled": {
                internals.ariaDisabled = String(newValue !== null);
                break;
            }
            case "expanded": {
                internals.ariaExpanded = String(newValue !== null);
                break;
            }
            case "label": {
                internals.ariaLabel = newValue;
                break;
            }
        }
    }
    toggle(force) {
        const { type, expanded } = this;
        switch (type) {
            case "menu":
            case "submenu": {
                const expand = force ?? !expanded;
                this.expanded = expand;
                if (expand) {
                    __classPrivateFieldGet(this, _HTMLEMenuItemElementBase_instances, "m", _HTMLEMenuItemElementBase_positionMenu).call(this);
                }
                this.dispatchEvent(new Event("toggle", { bubbles: true }));
                break;
            }
        }
    }
    expand() {
        const { type, expanded } = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (!expanded) {
                    this.expanded = true;
                    __classPrivateFieldGet(this, _HTMLEMenuItemElementBase_instances, "m", _HTMLEMenuItemElementBase_positionMenu).call(this);
                }
                break;
            }
        }
    }
    collapse() {
        const { type, expanded } = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (expanded) {
                    this.expanded = false;
                }
                break;
            }
        }
    }
};
_HTMLEMenuItemElementBase_instances = new WeakSet(), _HTMLEMenuItemElementBase_positionMenu = function _HTMLEMenuItemElementBase_positionMenu() {
    const { menu } = this;
    if (menu !== null) {
        const { width, height } = this.getBoundingClientRect();
        const { style: menuStyle } = menu;
        const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
        const { clientWidth, clientHeight } = document.body;
        const { type, offsetLeft, offsetTop } = this;
        const overflowX = offsetLeft + width + menuWidth - clientWidth;
        const overflowY = offsetTop + menuHeight - clientHeight;
        if (type === "menu") {
            menuStyle.setProperty("left", `${overflowX > 0 ?
                offsetLeft + width - menuWidth :
                offsetLeft}px`);
            menuStyle.setProperty("top", `${overflowY > 0 ?
                offsetTop - menuHeight :
                offsetTop + height}px`);
        }
        else {
            menuStyle.setProperty("left", `${overflowX > 0 ?
                offsetLeft - menuWidth :
                offsetLeft + width}px`);
            menuStyle.setProperty("top", `${overflowY > 0 ?
                offsetTop + height - menuHeight :
                offsetTop}px`);
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("span", {
        attributes: {
            part: "icon"
        }
    }), element("span", {
        attributes: {
            part: "label"
        },
        children: [
            element("slot")
        ]
    }), element("span", {
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
                display: flex;
                user-select: none;
                white-space: nowrap;
                box-sizing: border-box;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:focus-within) {
                background-color: ${DEFAULT_THEME_FOCUSED_ITEM_COLOR};
            }
            
            :host(:is([type="menu"], [type="submenu"])) ::slotted([slot="menu"]) {
                z-index: 1;
                position: absolute;
            }
            
            :host(:is([type="menu"], [type="submenu"]):not([expanded])) ::slotted([slot="menu"]) {
                width: 0;
                height: 0;
                padding: 0;
                opacity: 0;
                pointer-events: none;
                overflow: hidden;
            }
            
            :host([type="submenu"]) [part="icon"] {
                visibility: hidden;
            }
            
            :host([type="menu"]) [part="icon"],
            :host(:not([type="submenu"])) [part="arrow"] {
                display: none;
            }
            
            :host(:is([type="checkbox"], [type="radio"])[checked]) [part="icon"]::before {
                -webkit-mask-image: var(--theme-arrow-done-image, url(${DEFAULT_THEME_CHECKED_IMAGE}));
                mask-image: var(--theme-arrow-done-image, url(${DEFAULT_THEME_CHECKED_IMAGE}));
                background-color: black;
            }
            
            :host([type="submenu"]) [part="arrow"]::after {
                -webkit-mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                background-color: black;
            }
            
            [part="icon"],
            [part="label"],
            [part="arrow"] {
                pointer-events: none;
            }
            
            [part="icon"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                padding: 2px;
                overflow: hidden;
                margin-right: 4px;
            }
            
            [part="label"] {
                flex: auto;
                line-height: 18px;
                padding: 2px;
                margin-left: 8px;
                margin-right: 8px;
            }
            
            :host(:is(:not([type]), [type="button"], [type="radio"], [type="checkbox"])[checked]) [part="icon"] {
                background-color: var(--theme-activated-item-color, ${DEFAULT_THEME_ACTIVATED_ITEM_COLOR});
            }
            
            :host(:is(:not([type]), [type="button"], [type="radio"], [type="checkbox"])) [part="icon"]::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;

                mask-image: none;
                -webkit-mask-image: none;
                background-color: none;
            }
            
            [part="arrow"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px 4px 1px 1px;
            }
            
            [part="arrow"]::after {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;

                mask-image: none;
                -webkit-mask-image: none;
                background-color: none;
            }

            :host(:hover):host-context(e-menubar:focus),
            :host(:hover):host-context(e-menubar:not(:focus-within)) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
        `;
})();
__decorate([
    QueryProperty({ selector: ":scope > e-menu[slot=menu]" })
], HTMLEMenuItemElementBase.prototype, "menu", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEMenuItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuItemElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuItemElementBase.prototype, "hotkey", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEMenuItemElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEMenuItemElementBase.prototype, "checked", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEMenuItemElementBase.prototype, "expanded", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuItemElementBase.prototype, "overflown", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "button", observed: true })
], HTMLEMenuItemElementBase.prototype, "type", void 0);
HTMLEMenuItemElementBase = __decorate([
    CustomElement({
        name: "e-menuitem"
    })
], HTMLEMenuItemElementBase);
var HTMLEMenuItemElement = HTMLEMenuItemElementBase;
var EMenuItem = Object.assign(function (init) {
    const { label, name, type, value, trigger, menu } = init;
    if (menu) {
        menu.slot = "menu";
    }
    return element("e-menuitem", {
        attributes: {
            tabindex: -1,
            title: label,
            name: name,
            value: value,
            type: type
        },
        children: menu ? [
            label,
            menu
        ] : [
            label
        ],
        listeners: {
            click: trigger
        }
    });
}, {
    prototype: HTMLEMenuItemElement.prototype,
    button(init) {
        return new EMenuItem({
            ...init, type: "button"
        });
    },
    checkbox(init) {
        return new EMenuItem({
            ...init, type: "checkbox"
        });
    },
    radio(init) {
        return new EMenuItem({
            ...init, type: "radio"
        });
    },
    menu(init) {
        return new EMenuItem({
            ...init, type: "menu"
        });
    },
    submenu(init) {
        return new EMenuItem({
            ...init, type: "submenu"
        });
    }
});
//# sourceMappingURL=MenuItem.js.map