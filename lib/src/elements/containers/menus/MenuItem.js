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
import { CustomElement, AttributeProperty, QueryProperty, element } from "../../Element";
export { HTMLEMenuItemElement };
export { EMenuItem };
var shadowTemplate;
let HTMLEMenuItemElementBase = class HTMLEMenuItemElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEMenuItemElementBase_instances.add(this);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const internals = this.attachInternals();
        this.internals = internals;
        internals.role = "menuitem";
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
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
    connectedCallback() {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
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
        const { style: menuStyle } = menu;
        const { top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight } = this.getBoundingClientRect();
        const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
        const { scrollY, scrollX } = window;
        const { clientWidth, clientHeight } = document.body;
        const { type } = this;
        if (type == "menu") {
            const overflowX = itemRight + menuWidth - clientWidth;
            const overflowY = itemTop + menuHeight - clientHeight;
            menuStyle.setProperty("left", `${overflowX > 0 ?
                scrollX + itemRight - menuWidth :
                scrollX + itemLeft}px`);
            menuStyle.setProperty("top", `${overflowY > 0 ?
                scrollY + itemTop - menuHeight :
                scrollY + itemBottom}px`);
        }
        else {
            const closestMenu = this.closest("e-menu");
            if (closestMenu !== null) {
                const { top: closestMenuTop, left: closestMenuLeft } = closestMenu.getBoundingClientRect();
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${overflowX > 0 ?
                    itemLeft - menuWidth - closestMenuLeft :
                    itemRight - closestMenuLeft}px`);
                menuStyle.setProperty("top", `${overflowY > 0 ?
                    itemBottom - menuHeight - closestMenuTop :
                    itemTop - closestMenuTop}px`);
            }
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