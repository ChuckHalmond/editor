var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";
import "./GridRow";
import "./GridCell";
export { HTMLEGridHeadElement };
var shadowTemplate;
var style;
let HTMLEGridHeadElementBase = class HTMLEGridHeadElementBase extends HTMLElement {
    cells() {
        return Array.from(this.querySelectorAll("e-gridcell"));
    }
    rows() {
        return Array.from(this.querySelectorAll("e-gridrow"));
    }
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("slot"));
        style = /*css*/ `
            :host {
                display: table-header-group;
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
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const assignedItems = target
            .assignedElements()
            .filter(element_i => element_i instanceof HTMLEGridCellElement);
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
    }
};
HTMLEGridHeadElementBase = __decorate([
    CustomElement({
        name: "e-gridhead"
    })
], HTMLEGridHeadElementBase);
var HTMLEGridHeadElement = HTMLEGridHeadElementBase;
//# sourceMappingURL=GridHead.js.map