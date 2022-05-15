var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
export { HTMLETabPanelElement };
let HTMLETabPanelElementBase = class HTMLETabPanelElementBase extends HTMLElement {
    name;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: block;
                        }
        
                        :host([hidden]) {
                            display: none;
                        }
                    `
            }
        }), HTML("slot"));
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLETabPanelElementBase.prototype, "name", void 0);
HTMLETabPanelElementBase = __decorate([
    CustomElement({
        name: "e-tabpanel"
    })
], HTMLETabPanelElementBase);
var HTMLETabPanelElement = HTMLETabPanelElementBase;
//# sourceMappingURL=TabPanel.js.map