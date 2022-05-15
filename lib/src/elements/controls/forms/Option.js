var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
export { HTMLEOptionElement };
let HTMLEOptionElementBase = class HTMLEOptionElementBase extends HTMLElement {
    name;
    value;
    label;
    description;
    disabled;
    selected;
    default;
    shadowRoot;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: flex;
                            user-select: none;
                            white-space: nowrap;
                            padding: 2px 12px;
                        }
                        
                        :host(:focus-within) {
                            color: black;
                            background-color: lightgray;
                        }
        
                        :host([disabled]) {
                            color: dimgray;
                        }

                        :host::before {
                            display: flex;
                            content: "";
                            width: 18px;
                            height: 18px;
                            margin-right: 6px;

                            content: var(--icon-content, "");
                            color: var(--icon-color, unset);
                            background-color: var(--icon-mask-color, none);
                            -webkit-mask-image: var(--icon-mask-image, none);
                            mask-image: var(--icon-mask-image, none);
                        }

                        [part="label"] {
                            flex: auto;
                            text-align: left;
                        }

                        :host([default])::after {
                            display: inline-block;
                            content: "(default)";
                            margin-left: 24px;
                            text-align: right;
                        }

                        [part="content"] {
                            flex: auto;
                            display: flex;
                            overflow: hidden;
                            pointer-events: none;
                        }
                    `
            }
        }), HTML("span", {
            part: ["content"],
            children: [
                HTML("span", {
                    part: ["label"]
                })
            ]
        }));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            switch (name) {
                case "label": {
                    const { shadowRoot } = this;
                    const labelPart = shadowRoot.querySelector("[part='label']");
                    if (labelPart) {
                        labelPart.textContent = newValue;
                    }
                    break;
                }
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEOptionElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEOptionElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEOptionElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEOptionElementBase.prototype, "description", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEOptionElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEOptionElementBase.prototype, "selected", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEOptionElementBase.prototype, "default", void 0);
HTMLEOptionElementBase = __decorate([
    CustomElement({
        name: "e-option"
    })
], HTMLEOptionElementBase);
var HTMLEOptionElement = HTMLEOptionElementBase;
//# sourceMappingURL=Option.js.map