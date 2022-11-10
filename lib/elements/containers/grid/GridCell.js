var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, element, AttributeProperty } from "../../Element";
export { HTMLEGridCellElement };
var shadowTemplate;
var style;
let HTMLEGridCellElementBase = class HTMLEGridCellElementBase extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", { bubbles: true }));
                break;
            }
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                display: table-cell;
                text-align: left;
            }
            
            :host([type="columnheader"]:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host(:hover):host-context(e-grid:is(:not([selectby]), [selectby="cell"])) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([type="columnheader"][active]) {
                background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
            }
            
            :host([active]):host-context(e-grid:focus-within:is(:not([selectby]), [selectby="cell"])) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([selected]):host-context(e-grid:is(:not([selectby]), [selectby="cell"])) {
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEGridCellElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEGridCellElementBase.prototype, "headers", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEGridCellElementBase.prototype, "type", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLEGridCellElementBase.prototype, "posinset", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEGridCellElementBase.prototype, "droptarget", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEGridCellElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEGridCellElementBase.prototype, "selected", void 0);
HTMLEGridCellElementBase = __decorate([
    CustomElement({
        name: "e-gridcell"
    })
], HTMLEGridCellElementBase);
var HTMLEGridCellElement = HTMLEGridCellElementBase;
//# sourceMappingURL=GridCell.js.map