var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty } from "../../Element";
export { HTMLETabElement };
let HTMLETabElementBase = class HTMLETabElementBase extends HTMLElement {
    constructor() {
        super();
    }
    get panel() {
        const { controls } = this;
        return this.getRootNode().querySelector(`e-tabpanel#${controls}`);
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