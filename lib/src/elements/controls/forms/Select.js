var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HTMLEActionElement } from "../../containers/actions/Action";
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEOptionElement } from "./Option";
export { HTMLESelectElement };
let HTMLESelectElementBase = class HTMLESelectElementBase extends HTMLEActionElement {
    name;
    label;
    value;
    type;
    expanded;
    shadowRoot;
    #options;
    #activeIndex;
    #selectedIndex;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: inline-block;
                            user-select: none;
                        }
                        
                        [part="selected"] {
                            display: flex;
                            overflow: hidden;
                            padding: 0 4px;
                            pointer-events: none;
                        }

                        [part="description"] {
                            padding: 2px 6px;
                        }

                        [part="label"] {
                            flex: auto;
                            margin-right: 16px;
                        }

                        [part="value"] {
                            flex: auto;
                            text-align: right;
                        }

                        [part="options"] {
                            z-index: 1;
                            position: absolute;

                            display: flex;
                            flex-direction: column;
                            
                            padding: 6px 0;

                            background-color: white;

                            -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                            -moz-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                        }
        
                        :host(:not([expanded])) [part="options"] {
                            opacity: 0;
                            pointer-events: none !important;
                        }
        
                        [part="selected"]::after {
                            display: inline-block;
                            text-align: center;
                            width: 18px;
                            height: 18px;
                            margin-left: 6px;
                            content: "▼";
                        }
        
                        hr {
                            margin: 6px 0;
                        }
                    `
            }
        }), HTML("div", {
            part: ["container"],
            children: [
                HTML("div", {
                    part: ["selected"],
                    children: [
                        HTML("label", {
                            part: ["label"]
                        }),
                        HTML("output", {
                            part: ["value"]
                        })
                    ]
                }),
                HTML("div", {
                    part: ["options"],
                    children: [
                        HTML("slot"),
                        HTML("hr", {
                            part: ["separator"]
                        }),
                        HTML("span", {
                            part: ["description"]
                        })
                    ]
                })
            ]
        }));
        this.#options = [];
        this.#activeIndex = -1;
        this.#selectedIndex = -1;
    }
    get options() {
        return this.#options;
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get selectedIndex() {
        return this.#selectedIndex;
    }
    get activeOption() {
        return this.options[this.activeIndex] ?? null;
    }
    get selectedOption() {
        return this.options[this.selectedIndex] ?? null;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("click", this);
        this.addEventListener("mouseover", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("keydown", this);
    }
    handleEvent(event) {
        const { type: eventType, target: eventTarget } = event;
        switch (eventType) {
            case "slotchange": {
                this.#options = eventTarget
                    .assignedElements()
                    .filter(element_i => element_i instanceof HTMLEOptionElement);
                const { options } = this;
                if (options.length > 0) {
                    let selectedIndex = -1;
                    let { value } = this;
                    if (value) {
                        selectedIndex = options.findIndex(option => option.value === value);
                    }
                    if (selectedIndex < 0) {
                        selectedIndex = options.findIndex(option => option.selected);
                    }
                    if (selectedIndex < 0) {
                        selectedIndex = options.findIndex(option => option.default);
                    }
                    if (selectedIndex < 0) {
                        selectedIndex = 0;
                    }
                    options.forEach((option, index) => {
                        option.selected = (index === selectedIndex);
                    });
                    this.#setSelectedOption(selectedIndex);
                }
                break;
            }
            case "mouseover": {
                const { options } = this;
                const mouseOverTargetIndex = options.indexOf(eventTarget);
                if (mouseOverTargetIndex > -1) {
                    this.focusOption(mouseOverTargetIndex);
                }
                break;
            }
            case "click": {
                const { options } = this;
                const clickTargetIndex = options.indexOf(eventTarget);
                if (clickTargetIndex > -1) {
                    this.selectOption(clickTargetIndex);
                    this.toggle(false);
                }
                else {
                    if (eventTarget === this) {
                        this.toggle();
                    }
                }
                break;
            }
            case "focusin": {
                const { options, expanded } = this;
                const focusInTargetIndex = options.findIndex((item) => item.contains(eventTarget));
                if (focusInTargetIndex > -1) {
                    if (!expanded) {
                        this.toggle(true);
                    }
                }
                this.#setActiveOption(focusInTargetIndex);
                break;
            }
            case "focusout": {
                const { expanded } = this;
                const lostFocusWithin = !this.contains(event.relatedTarget);
                if (lostFocusWithin) {
                    if (expanded) {
                        this.toggle(false);
                    }
                }
                break;
            }
            case "keydown": {
                const { options, activeIndex, selectedIndex, expanded } = this;
                switch (event.key) {
                    case "ArrowUp": {
                        if (expanded) {
                            if (activeIndex > 0) {
                                this.focusOption(activeIndex - 1);
                            }
                        }
                        else {
                            if (selectedIndex > 0) {
                                this.selectOption(selectedIndex - 1);
                            }
                        }
                        event.stopPropagation();
                        break;
                    }
                    case "ArrowDown": {
                        if (expanded) {
                            if (activeIndex < options.length - 1) {
                                this.focusOption(activeIndex + 1);
                            }
                        }
                        else {
                            if (selectedIndex < options.length - 1) {
                                this.selectOption(selectedIndex + 1);
                            }
                        }
                        event.stopPropagation();
                        break;
                    }
                    case "Home": {
                        if (expanded) {
                            this.focusOption(0);
                        }
                        else {
                            this.selectOption(0);
                        }
                        event.stopPropagation();
                        break;
                    }
                    case "End": {
                        if (expanded) {
                            this.focusOption(options.length - 1);
                        }
                        else {
                            this.selectOption(options.length - 1);
                        }
                        event.stopPropagation();
                        break;
                    }
                    case "Enter": {
                        if (expanded) {
                            this.selectOption(activeIndex);
                            this.toggle(false);
                        }
                        else {
                            this.focusOption(selectedIndex);
                        }
                        event.stopPropagation();
                        break;
                    }
                    case "Escape": {
                        if (expanded) {
                            this.toggle(false);
                            event.stopPropagation();
                        }
                        break;
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
                    const { options } = this;
                    const targetOptionIndex = options.findIndex(option => option.value === newValue);
                    if (targetOptionIndex > -1) {
                        this.#setSelectedOption(targetOptionIndex);
                        this.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                    break;
                }
            }
        }
    }
    toggle(force) {
        const { expanded } = this;
        const expand = force ?? !expanded;
        this.expanded = expand;
        if (expand) {
            const { selectedIndex } = this;
            this.#updateOptionsPosition();
            this.focusOption(selectedIndex);
        }
        else {
            this.focus();
        }
    }
    focusOption(index) {
        const { options } = this;
        const option = options[index];
        if (option) {
            option.focus();
        }
    }
    selectOption(index) {
        const { options } = this;
        const option = options[index];
        if (option && !option.disabled) {
            this.value = option.value;
        }
    }
    #setActiveOption(index) {
        const { options } = this;
        const option = options[index];
        if (option && !option.disabled) {
            const { shadowRoot } = this;
            const descriptionPart = shadowRoot.querySelector("[part='description']");
            if (descriptionPart) {
                descriptionPart.textContent = option.description;
            }
            this.#activeIndex = index;
        }
    }
    #setSelectedOption(index) {
        const { options } = this;
        const option = options[index];
        if (option && !option.disabled) {
            const { shadowRoot, selectedOption } = this;
            const valuePart = shadowRoot.querySelector("[part='value']");
            if (valuePart) {
                valuePart.textContent = option.label;
            }
            option.selected = true;
            if (selectedOption) {
                selectedOption.selected = false;
            }
            this.#selectedIndex = index;
        }
    }
    #updateOptionsPosition() {
        const { shadowRoot } = this;
        const options = shadowRoot.querySelector("[part='options']");
        const { style: optionsStyle } = options;
        const { bottom: selectBottom, left: selectLeft } = this.getBoundingClientRect();
        const { scrollX, scrollY } = window;
        optionsStyle.setProperty("top", `${selectBottom + scrollY}px`);
        optionsStyle.setProperty("left", `${selectLeft + scrollX}px`);
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLESelectElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLESelectElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLESelectElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "select", observed: true })
], HTMLESelectElementBase.prototype, "type", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLESelectElementBase.prototype, "expanded", void 0);
HTMLESelectElementBase = __decorate([
    CustomElement({
        name: "e-select"
    })
], HTMLESelectElementBase);
var HTMLESelectElement = HTMLESelectElementBase;
//# sourceMappingURL=Select.js.map