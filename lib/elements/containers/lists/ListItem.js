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
var _HTMLEListItemElementBase_instances, _HTMLEListItemElementBase_badge, _HTMLEListItemElementBase_toolbar, _HTMLEListItemElementBase_menu, _HTMLEListItemElementBase_handleSlotChangeEvent;
import { DEFAULT_THEME_DROPTARGET_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, element, AttributeProperty } from "../../Element";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEToolBarElement } from "../toolbars/ToolBar";
export { HTMLEListItemElement };
var shadowTemplate;
var style;
let HTMLEListItemElementBase = class HTMLEListItemElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEListItemElementBase_instances.add(this);
        _HTMLEListItemElementBase_badge.set(this, void 0);
        _HTMLEListItemElementBase_toolbar.set(this, void 0);
        _HTMLEListItemElementBase_menu.set(this, void 0);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        __classPrivateFieldSet(this, _HTMLEListItemElementBase_badge, null, "f");
        __classPrivateFieldSet(this, _HTMLEListItemElementBase_menu, null, "f");
        __classPrivateFieldSet(this, _HTMLEListItemElementBase_toolbar, null, "f");
        shadowRoot.addEventListener("slotchange", __classPrivateFieldGet(this, _HTMLEListItemElementBase_instances, "m", _HTMLEListItemElementBase_handleSlotChangeEvent).bind(this));
    }
    get badge() {
        return __classPrivateFieldGet(this, _HTMLEListItemElementBase_badge, "f");
    }
    get toolbar() {
        return __classPrivateFieldGet(this, _HTMLEListItemElementBase_toolbar, "f");
    }
    get menu() {
        return __classPrivateFieldGet(this, _HTMLEListItemElementBase_menu, "f");
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", { bubbles: true }));
                break;
            }
            case "label": {
                const { shadowRoot } = this;
                const labelPart = shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
        }
    }
};
_HTMLEListItemElementBase_badge = new WeakMap(), _HTMLEListItemElementBase_toolbar = new WeakMap(), _HTMLEListItemElementBase_menu = new WeakMap(), _HTMLEListItemElementBase_instances = new WeakSet(), _HTMLEListItemElementBase_handleSlotChangeEvent = function _HTMLEListItemElementBase_handleSlotChangeEvent(event) {
    const { target } = event;
    const { name: slotName } = target;
    switch (slotName) {
        case "toolbar": {
            const element = target.assignedElements()[0];
            __classPrivateFieldSet(this, _HTMLEListItemElementBase_toolbar, element instanceof HTMLEToolBarElement ? element : null, "f");
            break;
        }
        case "badge": {
            const element = target.assignedElements()[0];
            __classPrivateFieldSet(this, _HTMLEListItemElementBase_badge, element instanceof HTMLSpanElement ? element : null, "f");
            break;
        }
        case "menu": {
            const element = target.assignedElements()[0];
            __classPrivateFieldSet(this, _HTMLEListItemElementBase_menu, element instanceof HTMLEMenuElement ? element : null, "f");
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
                user-select: none;
                line-height: 22px;
            }
            
            :host([droptarget]) {
                background-color: var(--theme-droptarget-item-color, ${DEFAULT_THEME_DROPTARGET_ITEM_COLOR});
            }
            
            :host(:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([active]) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host(:focus) {
                background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
            }
            
            :host([selected]) {
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEListItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLEListItemElementBase.prototype, "posinset", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEListItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEListItemElementBase.prototype, "droptarget", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEListItemElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEListItemElementBase.prototype, "selected", void 0);
HTMLEListItemElementBase = __decorate([
    CustomElement({
        name: "e-listitem"
    })
], HTMLEListItemElementBase);
var HTMLEListItemElement = HTMLEListItemElementBase;
//# sourceMappingURL=ListItem.js.map