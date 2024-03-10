var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_ACTIVATED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
export { HTMLEToolBarItemElement };
export { EToolBarItem };
var shadowTemplate;
var style;
var iconPartTemplate;
let HTMLEToolBarItemElementBase = class HTMLEToolBarItemElementBase extends HTMLElement {
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("slot"), element("slot", {
            attributes: {
                name: "select"
            }
        }), element("slot", {
            attributes: {
                name: "menubutton"
            }
        }));
        iconPartTemplate = element("span", {
            attributes: {
                part: "icon"
            }
        });
        style = /*css*/ `
            :host {
                display: flex;
                user-select: none;
                white-space: nowrap;
                cursor: pointer;
                line-height: 22px;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([pressed]),
            :host(:active) {
                background-color: var(--theme-activated-item-color, ${DEFAULT_THEME_ACTIVATED_ITEM_COLOR});
            }
            
            :host(:not([iconed])) [part="icon"] {
                display: none;
            }

            [part="icon"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                padding: 2px;
                overflow: hidden;
            }
            
            [part="icon"]::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                background-color: none;
                -webkit-mask-image: none;
                mask-image: none;
                filter: none;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([type="select"]:focus) ::slotted(e-select) {
                border-color: transparent;
            }
        `;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("focusin", () => {
            console.log("in");
        });
        this.addEventListener("focusout", () => {
            console.log("out");
        });
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "label": {
                //...
                break;
            }
            case "iconed": {
                const { shadowRoot } = this;
                if (newValue !== null) {
                    shadowRoot.prepend(iconPartTemplate.cloneNode(true));
                }
                else {
                    const iconPart = this.#icon();
                    if (iconPart) {
                        iconPart.remove();
                    }
                }
                break;
            }
        }
    }
    #icon() {
        return this.shadowRoot.querySelector("[part=icon]");
    }
};
__decorate([
    QueryProperty({ selector: ":scope > e-menubutton[slot=menubutton]" })
], HTMLEToolBarItemElementBase.prototype, "menubutton", void 0);
__decorate([
    QueryProperty({ selector: ":scope > e-select[slot=select]" })
], HTMLEToolBarItemElementBase.prototype, "select", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolBarItemElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolBarItemElementBase.prototype, "pressed", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolBarItemElementBase.prototype, "expanded", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEToolBarItemElementBase.prototype, "iconed", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemElementBase.prototype, "type", void 0);
HTMLEToolBarItemElementBase = __decorate([
    CustomElement({
        name: "e-toolbaritem"
    })
], HTMLEToolBarItemElementBase);
var HTMLEToolBarItemElement = HTMLEToolBarItemElementBase;
var EToolBarItem = Object.assign(function (init) {
    const { label, name, type, value, trigger, menubutton, select } = init;
    if (menubutton) {
        menubutton.slot = "menubutton";
    }
    if (select) {
        select.slot = "select";
    }
    return element("e-toolbaritem", {
        attributes: {
            tabindex: -1,
            title: label,
            name: name,
            value: value,
            type: type
        },
        children: menubutton ? [menubutton] : select ? [select] : undefined,
        listeners: {
            click: trigger
        }
    });
}, {
    prototype: HTMLEToolBarItemElement.prototype,
    button(init) {
        return new EToolBarItem({
            ...init, type: "button"
        });
    },
    checkbox(init) {
        return new EToolBarItem({
            ...init, type: "checkbox"
        });
    },
    radio(init) {
        return new EToolBarItem({
            ...init, type: "radio"
        });
    },
    menubutton(init) {
        return new EToolBarItem({
            ...init, type: "menubutton"
        });
    },
    select(init) {
        return new EToolBarItem({
            ...init, type: "select"
        });
    },
});
//# sourceMappingURL=ToolBarItem.js.map