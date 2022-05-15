var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLETabPanelElement } from "./TabPanel";
export { HTMLETabElement };
let HTMLETabElementBase = class HTMLETabElementBase extends HTMLElement {
    name;
    disabled;
    active;
    controls;
    #panel;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: inline-block;
                            
                            user-select: none;
                            white-space: nowrap;

                            padding: 2px 6px;
                            cursor: pointer;
                        }
                        
                        :host([disabled]) {
                            color: grey;
                            pointer-events: none;
                        }
        
                        :host([active]) {
                            background-color: lightgray;
                        }
                    `
            }
        }), HTML("slot"));
        this.#panel = null;
    }
    get panel() {
        return this.#panel;
    }
    connectedCallback() {
        const panel = document.getElementById(this.controls);
        if (panel !== this.#panel && panel instanceof HTMLETabPanelElement) {
            this.#panel = panel;
        }
        if (panel) {
            panel.hidden = !this.active;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            switch (name) {
                case "active":
                    if (this.active) {
                        this.dispatchEvent(new CustomEvent("e_tabchange", { detail: { tab: this }, bubbles: true }));
                    }
                    const panel = document.getElementById(this.controls);
                    if (panel !== this.panel && panel instanceof HTMLETabPanelElement) {
                        this.#panel = panel;
                    }
                    if (panel) {
                        panel.hidden = !this.active;
                    }
                    break;
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLETabElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETabElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLETabElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLETabElementBase.prototype, "controls", void 0);
HTMLETabElementBase = __decorate([
    CustomElement({
        name: "e-tab"
    })
], HTMLETabElementBase);
var HTMLETabElement = HTMLETabElementBase;
//# sourceMappingURL=Tab.js.map