var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_DROPTARGET_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, element, AttributeProperty } from "../../Element";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEToolBarElement } from "../toolbars/ToolBar";
export { HTMLEListItemElement };
var shadowTemplate;
var style;
let HTMLEListItemElementBase = class HTMLEListItemElementBase extends HTMLElement {
    get badge() {
        return this.#badge;
    }
    get toolbar() {
        return this.#toolbar;
    }
    get menu() {
        return this.#menu;
    }
    #badge;
    #toolbar;
    #menu;
    static {
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
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.#badge = null;
        this.#menu = null;
        this.#toolbar = null;
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
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
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const { name: slotName } = target;
        switch (slotName) {
            case "toolbar": {
                const element = target.assignedElements()[0];
                this.#toolbar = element instanceof HTMLEToolBarElement ? element : null;
                break;
            }
            case "badge": {
                const element = target.assignedElements()[0];
                this.#badge = element instanceof HTMLSpanElement ? element : null;
                break;
            }
            case "menu": {
                const element = target.assignedElements()[0];
                this.#menu = element instanceof HTMLEMenuElement ? element : null;
                break;
            }
        }
    }
};
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