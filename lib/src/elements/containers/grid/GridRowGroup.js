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
var _HTMLEGridRowGroupElementBase_instances, _HTMLEGridRowGroupElementBase_handleSlotChangeEvent;
import { CustomElement, element } from "../../Element";
import { HTMLEGridCellElement } from "./GridCell";
export { HTMLEGridRowGroupElement };
var shadowTemplate;
let HTMLEGridRowGroupElementBase = class HTMLEGridRowGroupElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEGridRowGroupElementBase_instances.add(this);
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        shadowRoot.addEventListener("slotchange", __classPrivateFieldGet(this, _HTMLEGridRowGroupElementBase_instances, "m", _HTMLEGridRowGroupElementBase_handleSlotChangeEvent).bind(this));
    }
};
_HTMLEGridRowGroupElementBase_instances = new WeakSet(), _HTMLEGridRowGroupElementBase_handleSlotChangeEvent = function _HTMLEGridRowGroupElementBase_handleSlotChangeEvent(event) {
    const { target } = event;
    const assignedItems = target
        .assignedElements()
        .filter(element_i => element_i instanceof HTMLEGridCellElement);
    assignedItems.forEach((item_i, i) => {
        item_i.posinset = i;
    });
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("style", {
        children: [
            /*css*/ `
                        :host {
                            display: table-row-group;
                            /*display: flex;
                            flex-direction: column;*/
                        }
                    `
        ]
    }), element("slot"));
})();
HTMLEGridRowGroupElementBase = __decorate([
    CustomElement({
        name: "e-gridrowgroup"
    })
], HTMLEGridRowGroupElementBase);
var HTMLEGridRowGroupElement = HTMLEGridRowGroupElementBase;
//# sourceMappingURL=GridRowGroup.js.map