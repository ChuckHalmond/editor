var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_HOVERED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import "./TabPanel";
export { HTMLETabElement };
var shadowTemplate;
var style;
let HTMLETabElementBase = class HTMLETabElementBase extends HTMLElement {
    get panel() {
        const { controls } = this;
        const rootNode = this.getRootNode();
        if (rootNode instanceof Document || rootNode instanceof ShadowRoot) {
            return rootNode.querySelector(`e-tabpanel[id='${controls}']`);
        }
        return null;
    }
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("slot"));
        style = /*css*/ `
            :host {
                display: inline-block;
                user-select: none;
                white-space: nowrap;
                padding: 4px;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
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
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", { bubbles: true }));
                break;
            }
        }
    }
    select() {
        this.selected = true;
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLETabElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETabElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLETabElementBase.prototype, "controls", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETabElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLETabElementBase.prototype, "selected", void 0);
HTMLETabElementBase = __decorate([
    CustomElement({
        name: "e-tab"
    })
], HTMLETabElementBase);
var HTMLETabElement = HTMLETabElementBase;
//# sourceMappingURL=Tab.js.map