var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
export { HTMLEStatusItemElement };
export { EStatusItem };
var shadowTemplate;
var style;
let HTMLEStatusItemElementBase = class HTMLEStatusItemElementBase extends HTMLElement {
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("span", {
            attributes: {
                part: "content"
            },
            children: element("slot")
        }));
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
            
            :host(:focus-within):host-context(e-statusbar:focus-within) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            [part="content"] {
                padding: 0 4px;
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
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
};
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEStatusItemElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEStatusItemElementBase.prototype, "name", void 0);
HTMLEStatusItemElementBase = __decorate([
    CustomElement({
        name: "e-statusitem"
    })
], HTMLEStatusItemElementBase);
var HTMLEStatusItemElement = HTMLEStatusItemElementBase;
var EStatusItem = Object.assign(function (init) {
    const { label, name, onclick } = init;
    return element("e-statusitem", {
        attributes: {
            title: label,
            name: name,
        },
        children: label,
        listeners: {
            click: onclick
        }
    });
}, {
    prototype: HTMLEStatusItemElement.prototype
});
//# sourceMappingURL=StatusItem.js.map