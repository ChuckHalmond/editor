var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEActionElement } from "../actions/Action";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";
export { HTMLEToolBarItemElement };
let HTMLEToolBarItemElementBase = class HTMLEToolBarItemElementBase extends HTMLEActionElement {
    value;
    label;
    type;
    #menubutton;
    #select;
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
                            cursor: pointer;
                            border-radius: 4px;
                        }

                        :host(:hover),
                        :host(:focus-within) {
                            color: black;
                            background-color: lightgray;
                        }

                        :host(:not([type])),
                        :host([type="button"]),
                        :host([type="checkbox"]),
                        :host([type="radio"]) {
                            min-height: 18px;
                            min-width: 18px;
                            margin: 1px;
                        }

                        :host(:not([type]))::before,
                        :host([type="button"])::before,
                        :host([type="checkbox"])::before,
                        :host([type="radio"])::before {
                            display: flex;
                            content: "";
                            width: 18px;
                            height: 18px;
                        }

                        :host(:not([type]))::before,
                        :host([type="button"])::before,
                        :host([type="radio"])::before,
                        :host([type="checkbox"])::before {
                            background-color: var(--icon-mask-color, black);
                            -webkit-mask-image: var(--icon-mask-image, var(--default-icon-mask-image));
                            mask-image: var(--icon-mask-image, var(--default-icon-mask-image));
                        }

                        :host([type="menubutton"]),
                        :host([type="select"]) {
                            min-height: 18px;
                            width: auto;
                            margin: 1px;
                        }
        
                        :host([disabled]) {
                            color: dimgray;
                        }
        
                        [part="content"] {
                            flex: auto;
                            display: flex;
                        }
                        
                        [part="label"] {
                            flex: auto;
                        }

                        :host([type="menubutton"]) ::slotted([slot="menubutton"]:focus-within),
                        :host([type="select"]) ::slotted([slot="select"]:focus-within) {
                            pointer-events: auto;
                        }
                    `
            }
        }), HTML("span", {
            part: ["content"],
            children: [
                HTML("span", {
                    part: ["label"]
                }),
                HTML("slot", {
                    properties: {
                        name: "select"
                    }
                }),
                HTML("slot", {
                    properties: {
                        name: "menubutton"
                    }
                })
            ]
        }));
        this.#menubutton = null;
        this.#select = null;
    }
    get menubutton() {
        return this.#menubutton;
    }
    get select() {
        return this.#select;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("focusout", this);
        this.addEventListener("click", this);
        this.addEventListener("change", this);
    }
    handleEvent(event) {
        const { type: eventType, target: eventTarget } = event;
        switch (eventType) {
            case "slotchange": {
                const slot = eventTarget;
                const element = slot.assignedElements()[0];
                const { name } = slot;
                if (name === "menubutton") {
                    this.#menubutton = (element instanceof HTMLEMenuButtonElement) ? element : null;
                }
                else if (name === "select") {
                    this.#select = (element instanceof HTMLESelectElement) ? element : null;
                    this.#updateSelectValue();
                }
                break;
            }
            case "click": {
                if (eventTarget === this) {
                    const { type } = this;
                    switch (type) {
                        case "menubutton":
                        case "select":
                            this.toggle();
                            break;
                        default:
                            this.trigger();
                            break;
                    }
                }
                break;
            }
            case "change": {
                const { select, type } = this;
                if (eventTarget === select && select && type === "select") {
                    const { value } = this;
                    const { value: selectValue } = select;
                    if (value !== selectValue) {
                        this.value = selectValue;
                        this.trigger();
                    }
                }
                break;
            }
        }
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
                case "value": {
                    const { type } = this;
                    if (type === "select") {
                        this.#updateSelectValue();
                    }
                    break;
                }
            }
        }
    }
    toggle(force) {
        switch (this.type) {
            case "menubutton": {
                const { menubutton } = this;
                if (menubutton) {
                    menubutton.toggle(force);
                    const { expanded } = menubutton;
                    if (expanded) {
                        menubutton.focusMenu();
                    }
                }
                break;
            }
            case "select": {
                const { select } = this;
                if (select) {
                    select.toggle(force);
                    const { expanded, selectedIndex } = select;
                    if (expanded) {
                        select.focusOption(selectedIndex);
                    }
                }
                break;
            }
        }
    }
    #updateSelectValue() {
        const { select } = this;
        if (select) {
            const { value } = this;
            const { value: selectValue } = select;
            if (selectValue !== value) {
                select.value = value;
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemElementBase.prototype, "type", void 0);
HTMLEToolBarItemElementBase = __decorate([
    CustomElement({
        name: "e-toolbaritem"
    })
], HTMLEToolBarItemElementBase);
var HTMLEToolBarItemElement = HTMLEToolBarItemElementBase;
//# sourceMappingURL=ToolBarItem.js.map