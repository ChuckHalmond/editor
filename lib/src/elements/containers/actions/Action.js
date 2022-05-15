var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AttributeProperty } from "../../Element";
export { HTMLEActionElement };
class HTMLEActionElementBase extends HTMLElement {
    name;
    value;
    hotkey;
    type;
    disabled;
    checked;
    constructor() {
        super();
    }
    trigger() {
        if (!this.disabled) {
            switch (this.type) {
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "radio":
                    this.checked = true;
                    break;
            }
            this.dispatchEvent(new Event("trigger", {
                bubbles: true
            }));
        }
    }
    enable() {
        this.disabled = false;
    }
    disable() {
        this.disabled = true;
    }
}
__decorate([
    AttributeProperty({ type: String })
], HTMLEActionElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEActionElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEActionElementBase.prototype, "hotkey", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "button" })
], HTMLEActionElementBase.prototype, "type", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEActionElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEActionElementBase.prototype, "checked", void 0);
var HTMLEActionElement = HTMLEActionElementBase;
//# sourceMappingURL=Action.js.map