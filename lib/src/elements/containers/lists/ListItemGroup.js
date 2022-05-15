var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, HTML } from "../../Element";
import { HTMLEListItemElement } from "./ListItem";
export { HTMLEListItemGroupElement };
let HTMLEListItemGroupElementBase = class HTMLEListItemGroupElementBase extends HTMLElement {
    shadowRoot;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(HTML("style", {
            properties: {
                textContent: /*css*/ `
                        :host {
                            display: block;
                        }
                    `
            }
        }), HTML("slot"));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    get items() {
        const { children } = this;
        return Array.from(children).filter(child_i => child_i instanceof HTMLEListItemElement);
    }
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const assignedItems = target
            .assignedElements()
            .filter(element_i => element_i instanceof HTMLEListItemElement);
        assignedItems.forEach((item_i, i) => {
            item_i.index = i;
        });
    }
};
HTMLEListItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-listitemgroup"
    })
], HTMLEListItemGroupElementBase);
var HTMLEListItemGroupElement = HTMLEListItemGroupElementBase;
//# sourceMappingURL=ListItemGroup.js.map