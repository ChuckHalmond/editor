var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, HTML, AttributeProperty } from "../../Element";
import { HTMLEContextMenuElement } from "../menus/ContextMenu";
import { HTMLEToolbarElement } from "../toolbars/ToolBar";
export { HTMLEListItemElement };
let HTMLEListItemElementBase = class HTMLEListItemElementBase extends HTMLElement {
    name;
    index;
    label;
    droptarget;
    active;
    selected;
    #toolbar;
    #badge;
    #contextmenu;
    shadowRoot;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                textContent: /*css*/ `
                        :host {
                            display: block;
                            user-select: none;
                        }

                        :host(:focus-visible) {
                            outline: none;
                        }
                        
                        :host([droptarget]) {
                            background-color: gainsboro;
                        }
                        
                        [part="content"]:hover {
                            background-color: whitesmoke;
                        }

                        :host([active]) [part="content"] {
                            background-color: whitesmoke;
                            outline: 1px solid black;
                            outline-offset: -1px;
                        }

                        :host([selected]) [part="content"] {
                            background-color: gainsboro;
                        }

                        [part="content"] {
                            display: flex;
                            height: 20px;
                        }
                        
                        [part="label"] {
                            order: 0;
                            margin-right: auto;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            pointer-events: none;
                        }

                        ::slotted([slot="toolbar"]) {
                            order: 1;
                        }

                        ::slotted([slot="badge"]) {
                            order: 2;
                            pointer-events: none;
                        }

                        ::slotted([slot="contextmenu"]) {
                            position: absolute;
                        }
                    `
            }
        }), HTML("div", {
            part: ["content"],
            children: [
                HTML("span", {
                    part: ["label"]
                }),
                HTML("slot", {
                    properties: {
                        name: "toolbar"
                    }
                }),
                HTML("slot", {
                    properties: {
                        name: "badge"
                    }
                })
            ]
        }), HTML("slot", {
            properties: {
                name: "contextmenu"
            }
        }));
        this.#toolbar = null;
        this.#badge = null;
        this.#contextmenu = null;
        this.shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    get badge() {
        return this.#badge;
    }
    get toolbar() {
        return this.#toolbar;
    }
    get contextmenu() {
        return this.#contextmenu;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", { bubbles: true }));
                break;
            }
            case "label": {
                const { shadowRoot } = this;
                const labelPart = shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
        }
    }
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const { name: slotName } = target;
        switch (slotName) {
            case "toolbar": {
                const element = target.assignedElements()[0];
                this.#toolbar = (element instanceof HTMLEToolbarElement) ? element : null;
                break;
            }
            case "badge": {
                const element = target.assignedElements()[0];
                this.#badge = (element instanceof HTMLSpanElement) ? element : null;
                break;
            }
            case "contextmenu": {
                const element = target.assignedElements()[0];
                this.#contextmenu = (element instanceof HTMLEContextMenuElement) ? element : null;
                break;
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEListItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLEListItemElementBase.prototype, "index", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEListItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEListItemElementBase.prototype, "droptarget", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEListItemElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEListItemElementBase.prototype, "selected", void 0);
HTMLEListItemElementBase = __decorate([
    CustomElement({
        name: "e-listitem"
    })
], HTMLEListItemElementBase);
var HTMLEListItemElement = HTMLEListItemElementBase;
//# sourceMappingURL=ListItem.js.map