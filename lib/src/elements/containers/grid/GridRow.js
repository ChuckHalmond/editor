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
var _HTMLEGridRowElementBase_instances, _HTMLEGridRowElementBase_menu, _HTMLEGridRowElementBase_handleSlotChangeEvent;
import { AttributeProperty, CustomElement, element } from "../../Element";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridCellCollection } from "./GridCellCollection";
export { HTMLEGridRowElement };
var shadowTemplate;
let HTMLEGridRowElementBase = class HTMLEGridRowElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEGridRowElementBase_instances.add(this);
        _HTMLEGridRowElementBase_menu.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEGridRowElementBase_menu, null, "f");
        this.cells = new HTMLEGridCellCollection(this);
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        shadowRoot.addEventListener("slotchange", __classPrivateFieldGet(this, _HTMLEGridRowElementBase_instances, "m", _HTMLEGridRowElementBase_handleSlotChangeEvent).bind(this));
    }
    get menu() {
        return __classPrivateFieldGet(this, _HTMLEGridRowElementBase_menu, "f");
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
};
_HTMLEGridRowElementBase_menu = new WeakMap(), _HTMLEGridRowElementBase_instances = new WeakSet(), _HTMLEGridRowElementBase_handleSlotChangeEvent = function _HTMLEGridRowElementBase_handleSlotChangeEvent(event) {
    const { target } = event;
    const { name: slotName } = target;
    switch (slotName) {
        case "menu": {
            const element = target.assignedElements()[0];
            __classPrivateFieldSet(this, _HTMLEGridRowElementBase_menu, element instanceof HTMLEMenuElement ? element : null, "f");
            break;
        }
        default: {
            const assignedCells = target
                .assignedElements()
                .filter(element_i => element_i instanceof HTMLEGridCellElement);
            assignedCells.forEach((cell_i, i) => {
                cell_i.posinset = i;
            });
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("style", {
        children: [
            /*css*/ `
                        :host {
                            display: table-row;
                        }

                        :host([droptarget]) {
                            background-color: gainsboro;
                        }
                        
                        :host(:hover) {
                            background-color: rgba(135, 206, 250, 0.2);
                        }

                        :host([active]) {
                            outline: 1px solid rgb(135, 206, 250);
                            outline-offset: -1px;
                        }

                        :host([selected]) {
                            background-color: rgba(135, 206, 250, 0.4);
                            outline: 1px solid rgb(135, 206, 250);
                            outline-offset: -1px;
                        }
                    `
        ]
    }), element("slot"), element("slot", {
        attributes: {
            name: "menu"
        }
    }));
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