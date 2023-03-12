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
var _HTMLEGridRowElementBase_instances, _HTMLEGridRowElementBase_handleSlotChangeEvent;
import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { AttributeProperty, CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";
import "./GridCell";
export { HTMLEGridRowElement };
var shadowTemplate;
var style;
let HTMLEGridRowElementBase = class HTMLEGridRowElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEGridRowElementBase_instances.add(this);
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        shadowRoot.addEventListener("slotchange", __classPrivateFieldGet(this, _HTMLEGridRowElementBase_instances, "m", _HTMLEGridRowElementBase_handleSlotChangeEvent).bind(this));
    }
    cells() {
        return Array.from(this.querySelectorAll("e-gridcell"));
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
_HTMLEGridRowElementBase_instances = new WeakSet(), _HTMLEGridRowElementBase_handleSlotChangeEvent = function _HTMLEGridRowElementBase_handleSlotChangeEvent(event) {
    const { target } = event;
    const assignedCells = target
        .assignedElements()
        .filter(element_i => element_i instanceof HTMLEGridCellElement);
    assignedCells.forEach((cell_i, i) => {
        cell_i.posinset = i;
    });
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                display: table-row;
            }
            
            :host(:hover):host-context(e-grid:is([selectby="row"])) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([active]):host-context(e-grid:focus-within:is([selectby="row"])) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([selected]):host-context(e-grid:is([selectby="row"])) {
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEGridRowElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEGridRowElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEGridRowElementBase.prototype, "selected", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLEGridRowElementBase.prototype, "posinset", void 0);
HTMLEGridRowElementBase = __decorate([
    CustomElement({
        name: "e-gridrow"
    })
], HTMLEGridRowElementBase);
var HTMLEGridRowElement = HTMLEGridRowElementBase;
//# sourceMappingURL=GridRow.js.map