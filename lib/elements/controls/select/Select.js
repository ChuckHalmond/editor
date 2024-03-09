var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionGroupElement } from "./OptionGroup";
export { HTMLESelectElement };
var shadowTemplate;
var style;
var mutationObserver;
let HTMLESelectElementBase = class HTMLESelectElementBase extends HTMLElement {
    internals;
    static get formAssociated() {
        return true;
    }
    get options() {
        return Array.from(this.querySelectorAll("e-option"));
    }
    get activeOption() {
        return this.querySelector("e-option:focus-within") ?? null;
    }
    get selectedOption() {
        return this.querySelector("e-option[selected]") ?? null;
    }
    #walker;
    #wasExpandedOnMouseDown;
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(element("div", {
            attributes: {
                part: "content"
            },
            children: [
                element("output", {
                    attributes: {
                        part: "value"
                    }
                })
            ]
        }), element("div", {
            attributes: {
                part: "box"
            },
            children: element("slot")
        }));
        style = /*css*/ `
            :host {
                position: relative;
                display: inline-block;
                user-select: none;
                line-height: 20px;
                border: 1px solid grey;
            }

            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host(:focus-within:not(:focus)) {
                background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            [part="content"] {
                display: flex;
                overflow: hidden;
                padding: 0 4px;
            }
            
            [part="content"]::after {
                display: inline-block;
                text-align: center;
                width: 20px;
                height: 20px;
                margin-left: 6px;
                content: "▾";
            }
            
            [part="value"] {
                margin-right: auto;
                text-align: right;
            }
            
            [part="box"] {
                z-index: 1;
                position: absolute;
            
                display: block;
                padding: 6px 0;
                width: max-content;
            
                background-color: white;
            
                -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                -moz-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
            }
            
            :host(:not([expanded])) [part="box"] {
                width: 0;
                height: 0;
                padding: 0;
                opacity: 0;
                pointer-events: none;
                overflow: hidden;
            }
        `;
        mutationObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                const { target } = mutation;
                const select = target;
                const { selectedOption, value, options } = select;
                if (!selectedOption) {
                    const optionToSelect = value ? options.find(option_i => option_i.value === value) : select.#firstOption();
                    if (optionToSelect) {
                        optionToSelect.selected = true;
                    }
                    else {
                        select.#setSelectedOption(null);
                    }
                }
            });
        });
    }
    constructor() {
        super();
        const internals = this.attachInternals();
        internals.role = "combobox";
        this.internals = internals;
        this.#wasExpandedOnMouseDown = false;
        this.#walker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this));
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        mutationObserver.observe(this, {
            childList: true,
            subtree: true
        });
    }
    connectedCallback() {
        const { options, selectedOption, value } = this;
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
        customElements.upgrade(this);
        const optionToSelect = selectedOption ?? (value ? options.find(option_i => option_i.value === value) : null) ?? this.#firstOption();
        if (optionToSelect) {
            if (optionToSelect === selectedOption) {
                this.#setSelectedOption(selectedOption);
            }
            else {
                this.#selectOption(optionToSelect);
            }
        }
    }
    expand() {
        const { expanded } = this;
        if (!expanded) {
            this.expanded = true;
            this.#positionBox();
            const { selectedOption } = this;
            if (selectedOption) {
                selectedOption.focus({ preventScroll: true });
            }
        }
    }
    collapse() {
        const { expanded } = this;
        if (expanded) {
            this.expanded = false;
            this.focus();
        }
    }
    toggle(force) {
        const { expanded } = this;
        const expand = force ?? !expanded;
        expand ? this.expand() : this.collapse();
    }
    #value() {
        return this.shadowRoot.querySelector("[part=value]");
    }
    #box() {
        return this.shadowRoot.querySelector("[part=box]");
    }
    #walkerNodeFilter(node) {
        if (node instanceof HTMLEOptionElement && !node.disabled && !node.hidden) {
            return NodeFilter.FILTER_ACCEPT;
        }
        else if (node instanceof HTMLEOptionGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }
    #firstOption() {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return walker.firstChild();
    }
    #lastOption() {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return walker.lastChild();
    }
    #previousOption(option) {
        const walker = this.#walker;
        walker.currentNode = option;
        return walker.previousNode();
    }
    #nextOption(option) {
        const walker = this.#walker;
        walker.currentNode = option;
        return walker.nextNode();
    }
    #selectOption(option) {
        const { selectedOption } = this;
        if (option !== selectedOption) {
            option.selected = true;
        }
    }
    #setSelectedOption(option) {
        const { label, value } = option ?? { label: "", value: "" };
        const { internals } = this;
        this.#value().textContent = label;
        internals.setFormValue(value);
    }
    #positionBox() {
        const box = this.#box();
        const { offsetLeft, offsetTop } = this;
        const { width, height } = this.getBoundingClientRect();
        const { style: boxStyle } = box;
        const { width: boxWidth, height: boxHeight } = box.getBoundingClientRect();
        const { clientWidth, clientHeight } = document.body;
        const overflowX = offsetLeft + width + boxWidth - clientWidth;
        const overflowY = offsetTop + boxHeight - clientHeight;
        boxStyle.setProperty("left", `${overflowX > 0 ?
            width - boxWidth :
            0}px`);
        boxStyle.setProperty("top", `${overflowY > 0 ?
            -(height - 1) :
            (height - 1)}px`);
    }
    #handleClickEvent(event) {
        const { target } = event;
        const { expanded } = this;
        const wasExpandedOnMouseDown = this.#wasExpandedOnMouseDown;
        if (!expanded && !wasExpandedOnMouseDown) {
            const { selectedOption } = this;
            this.expand();
            (selectedOption ?? this.#firstOption() ?? this).focus({ preventScroll: true });
        }
        else {
            this.collapse();
            const targetOption = target.closest("e-option");
            if (targetOption) {
                this.#selectOption(targetOption);
            }
        }
        this.#wasExpandedOnMouseDown = false;
        event.stopPropagation();
    }
    #handleFocusOutEvent(event) {
        const { relatedTarget } = event;
        const lostFocusWithin = !this.contains(relatedTarget);
        if (lostFocusWithin || this === relatedTarget) {
            this.collapse();
        }
    }
    #handleMouseDownEvent() {
        const { expanded } = this;
        this.#wasExpandedOnMouseDown = expanded;
    }
    #handleMouseOverEvent(event) {
        const { target } = event;
        const targetOption = target.closest("e-option");
        if (targetOption) {
            targetOption.focus({ preventScroll: true });
        }
    }
    #handleKeyDownEvent(event) {
        const { key } = event;
        const { expanded, activeOption, selectedOption } = this;
        switch (key) {
            case "ArrowUp": {
                if (expanded) {
                    const previousOption = activeOption ?
                        this.#previousOption(activeOption) :
                        this.#firstOption();
                    if (previousOption) {
                        previousOption.focus({ preventScroll: true });
                    }
                }
                else {
                    const previousOption = selectedOption ?
                        this.#previousOption(selectedOption) :
                        this.#firstOption();
                    if (previousOption) {
                        this.#selectOption(previousOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (expanded) {
                    const nextOption = activeOption ?
                        this.#nextOption(activeOption) :
                        this.#lastOption();
                    if (nextOption) {
                        nextOption.focus({ preventScroll: true });
                    }
                }
                else {
                    const nextOption = selectedOption ?
                        this.#nextOption(selectedOption) :
                        this.#lastOption();
                    if (nextOption) {
                        this.#selectOption(nextOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstOption = this.#firstOption();
                if (firstOption) {
                    if (expanded) {
                        firstOption.focus({ preventScroll: true });
                    }
                    else {
                        this.#selectOption(firstOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastOption = this.#lastOption();
                if (lastOption) {
                    if (expanded) {
                        lastOption.focus({ preventScroll: true });
                    }
                    else {
                        this.#selectOption(lastOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Enter":
            case " ": {
                (activeOption ?? this).click();
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.collapse();
                    event.stopPropagation();
                    event.preventDefault();
                }
                break;
            }
            default: {
                const { length: keyLength } = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const { options } = this;
                    const activeIndex = activeOption ? options.indexOf(activeOption) : -1;
                    const matchingOption = options.find((option_i, i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode && i > activeIndex) ?? options.find((option_i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode);
                    if (matchingOption) {
                        matchingOption.focus({ preventScroll: true });
                    }
                    event.stopPropagation();
                }
                break;
            }
        }
    }
    #handleSelectEvent(event) {
        const { target } = event;
        const targetOption = target.closest("e-option");
        if (targetOption) {
            const { selected } = targetOption;
            if (selected) {
                const { options } = this;
                options.forEach((option_i) => {
                    if (option_i !== targetOption && option_i.selected) {
                        option_i.selected = false;
                    }
                });
                this.#setSelectedOption(targetOption);
            }
            else {
                const { selectedOption } = this;
                if (selectedOption === null) {
                    const firstOption = this.#firstOption();
                    if (firstOption !== null) {
                        this.#setSelectedOption(firstOption);
                    }
                }
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLESelectElementBase.prototype, "name", void 0);
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