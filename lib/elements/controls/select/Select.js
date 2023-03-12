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
var _HTMLESelectElementBase_instances, _HTMLESelectElementBase_walker, _HTMLESelectElementBase_wasExpandedOnMouseDown, _HTMLESelectElementBase_value, _HTMLESelectElementBase_box, _HTMLESelectElementBase_walkerNodeFilter, _HTMLESelectElementBase_firstOption, _HTMLESelectElementBase_lastOption, _HTMLESelectElementBase_previousOption, _HTMLESelectElementBase_nextOption, _HTMLESelectElementBase_selectOption, _HTMLESelectElementBase_setSelectedOption, _HTMLESelectElementBase_positionBox, _HTMLESelectElementBase_handleClickEvent, _HTMLESelectElementBase_handleFocusOutEvent, _HTMLESelectElementBase_handleMouseDownEvent, _HTMLESelectElementBase_handleMouseOverEvent, _HTMLESelectElementBase_handleKeyDownEvent, _HTMLESelectElementBase_handleSelectEvent;
import { DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionGroupElement } from "./OptionGroup";
export { HTMLESelectElement };
var shadowTemplate;
var style;
var mutationObserver;
let HTMLESelectElementBase = class HTMLESelectElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLESelectElementBase_instances.add(this);
        _HTMLESelectElementBase_walker.set(this, void 0);
        _HTMLESelectElementBase_wasExpandedOnMouseDown.set(this, void 0);
        const internals = this.attachInternals();
        internals.role = "combobox";
        this.internals = internals;
        __classPrivateFieldSet(this, _HTMLESelectElementBase_wasExpandedOnMouseDown, false, "f");
        __classPrivateFieldSet(this, _HTMLESelectElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_walkerNodeFilter).bind(this)), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_handleClickEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("mousedown", __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_handleMouseDownEvent).bind(this));
        this.addEventListener("mouseover", __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_handleMouseOverEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_handleKeyDownEvent).bind(this));
        this.addEventListener("select", __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_handleSelectEvent).bind(this));
        mutationObserver.observe(this, {
            childList: true,
            subtree: true
        });
    }
    static get formAssociated() {
        return true;
    }
    get options() {
        return Array.from(this.querySelectorAll("e-option"));
    }
    get activeOption() {
        var _a;
        return (_a = this.querySelector("e-option:focus-within")) !== null && _a !== void 0 ? _a : null;
    }
    get selectedOption() {
        var _a;
        return (_a = this.querySelector("e-option[selected]")) !== null && _a !== void 0 ? _a : null;
    }
    connectedCallback() {
        var _a;
        const { options, selectedOption, value } = this;
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
        customElements.upgrade(this);
        const optionToSelect = (_a = selectedOption !== null && selectedOption !== void 0 ? selectedOption : (value ? options.find(option_i => option_i.value === value) : null)) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(this);
        if (optionToSelect) {
            if (optionToSelect === selectedOption) {
                __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_setSelectedOption).call(this, selectedOption);
            }
            else {
                __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_selectOption).call(this, optionToSelect);
            }
        }
    }
    expand() {
        const { expanded } = this;
        if (!expanded) {
            this.expanded = true;
            __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_positionBox).call(this);
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
        const expand = force !== null && force !== void 0 ? force : !expanded;
        expand ? this.expand() : this.collapse();
    }
};
_HTMLESelectElementBase_walker = new WeakMap(), _HTMLESelectElementBase_wasExpandedOnMouseDown = new WeakMap(), _HTMLESelectElementBase_instances = new WeakSet(), _HTMLESelectElementBase_value = function _HTMLESelectElementBase_value() {
    return this.shadowRoot.querySelector("[part=value]");
}, _HTMLESelectElementBase_box = function _HTMLESelectElementBase_box() {
    return this.shadowRoot.querySelector("[part=box]");
}, _HTMLESelectElementBase_walkerNodeFilter = function _HTMLESelectElementBase_walkerNodeFilter(node) {
    if (node instanceof HTMLEOptionElement && !node.disabled && !node.hidden) {
        return NodeFilter.FILTER_ACCEPT;
    }
    else if (node instanceof HTMLEOptionGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLESelectElementBase_firstOption = function _HTMLESelectElementBase_firstOption() {
    const walker = __classPrivateFieldGet(this, _HTMLESelectElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.firstChild();
}, _HTMLESelectElementBase_lastOption = function _HTMLESelectElementBase_lastOption() {
    const walker = __classPrivateFieldGet(this, _HTMLESelectElementBase_walker, "f");
    walker.currentNode = walker.root;
    return walker.lastChild();
}, _HTMLESelectElementBase_previousOption = function _HTMLESelectElementBase_previousOption(option) {
    const walker = __classPrivateFieldGet(this, _HTMLESelectElementBase_walker, "f");
    walker.currentNode = option;
    return walker.previousNode();
}, _HTMLESelectElementBase_nextOption = function _HTMLESelectElementBase_nextOption(option) {
    const walker = __classPrivateFieldGet(this, _HTMLESelectElementBase_walker, "f");
    walker.currentNode = option;
    return walker.nextNode();
}, _HTMLESelectElementBase_selectOption = function _HTMLESelectElementBase_selectOption(option) {
    const { selectedOption } = this;
    if (option !== selectedOption) {
        option.selected = true;
    }
}, _HTMLESelectElementBase_setSelectedOption = function _HTMLESelectElementBase_setSelectedOption(option) {
    const { label, value } = option !== null && option !== void 0 ? option : { label: "", value: "" };
    const { internals } = this;
    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_value).call(this).textContent = label;
    internals.setFormValue(value);
}, _HTMLESelectElementBase_positionBox = function _HTMLESelectElementBase_positionBox() {
    const box = __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_box).call(this);
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
}, _HTMLESelectElementBase_handleClickEvent = function _HTMLESelectElementBase_handleClickEvent(event) {
    var _a;
    const { target } = event;
    const { expanded } = this;
    const wasExpandedOnMouseDown = __classPrivateFieldGet(this, _HTMLESelectElementBase_wasExpandedOnMouseDown, "f");
    if (!expanded && !wasExpandedOnMouseDown) {
        const { selectedOption } = this;
        this.expand();
        ((_a = selectedOption !== null && selectedOption !== void 0 ? selectedOption : __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(this)) !== null && _a !== void 0 ? _a : this).focus({ preventScroll: true });
    }
    else {
        this.collapse();
        const targetOption = target.closest("e-option");
        if (targetOption) {
            __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_selectOption).call(this, targetOption);
        }
    }
    __classPrivateFieldSet(this, _HTMLESelectElementBase_wasExpandedOnMouseDown, false, "f");
    event.stopPropagation();
}, _HTMLESelectElementBase_handleFocusOutEvent = function _HTMLESelectElementBase_handleFocusOutEvent(event) {
    const { relatedTarget } = event;
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin || this === relatedTarget) {
        this.collapse();
    }
}, _HTMLESelectElementBase_handleMouseDownEvent = function _HTMLESelectElementBase_handleMouseDownEvent() {
    const { expanded } = this;
    __classPrivateFieldSet(this, _HTMLESelectElementBase_wasExpandedOnMouseDown, expanded, "f");
}, _HTMLESelectElementBase_handleMouseOverEvent = function _HTMLESelectElementBase_handleMouseOverEvent(event) {
    const { target } = event;
    const targetOption = target.closest("e-option");
    if (targetOption) {
        targetOption.focus({ preventScroll: true });
    }
}, _HTMLESelectElementBase_handleKeyDownEvent = function _HTMLESelectElementBase_handleKeyDownEvent(event) {
    var _a;
    const { key } = event;
    const { expanded, activeOption, selectedOption } = this;
    switch (key) {
        case "ArrowUp": {
            if (expanded) {
                const previousOption = activeOption ?
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_previousOption).call(this, activeOption) :
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(this);
                if (previousOption) {
                    previousOption.focus({ preventScroll: true });
                }
            }
            else {
                const previousOption = selectedOption ?
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_previousOption).call(this, selectedOption) :
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(this);
                if (previousOption) {
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_selectOption).call(this, previousOption);
                }
            }
            event.stopPropagation();
            break;
        }
        case "ArrowDown": {
            if (expanded) {
                const nextOption = activeOption ?
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_nextOption).call(this, activeOption) :
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_lastOption).call(this);
                if (nextOption) {
                    nextOption.focus({ preventScroll: true });
                }
            }
            else {
                const nextOption = selectedOption ?
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_nextOption).call(this, selectedOption) :
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_lastOption).call(this);
                if (nextOption) {
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_selectOption).call(this, nextOption);
                }
            }
            event.stopPropagation();
            break;
        }
        case "Home": {
            const firstOption = __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(this);
            if (firstOption) {
                if (expanded) {
                    firstOption.focus({ preventScroll: true });
                }
                else {
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_selectOption).call(this, firstOption);
                }
            }
            event.stopPropagation();
            break;
        }
        case "End": {
            const lastOption = __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_lastOption).call(this);
            if (lastOption) {
                if (expanded) {
                    lastOption.focus({ preventScroll: true });
                }
                else {
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_selectOption).call(this, lastOption);
                }
            }
            event.stopPropagation();
            break;
        }
        case "Enter":
        case " ": {
            (activeOption !== null && activeOption !== void 0 ? activeOption : this).click();
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
                const matchingOption = (_a = options.find((option_i, i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode && i > activeIndex)) !== null && _a !== void 0 ? _a : options.find((option_i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode);
                if (matchingOption) {
                    matchingOption.focus({ preventScroll: true });
                }
                event.stopPropagation();
            }
            break;
        }
    }
}, _HTMLESelectElementBase_handleSelectEvent = function _HTMLESelectElementBase_handleSelectEvent(event) {
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
            __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_setSelectedOption).call(this, targetOption);
        }
        else {
            const { selectedOption } = this;
            if (selectedOption === null) {
                const firstOption = __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(this);
                if (firstOption !== null) {
                    __classPrivateFieldGet(this, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_setSelectedOption).call(this, firstOption);
                }
            }
        }
    }
};
(() => {
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
                const optionToSelect = value ? options.find(option_i => option_i.value === value) : __classPrivateFieldGet(select, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_firstOption).call(select);
                if (optionToSelect) {
                    optionToSelect.selected = true;
                }
                else {
                    __classPrivateFieldGet(select, _HTMLESelectElementBase_instances, "m", _HTMLESelectElementBase_setSelectedOption).call(select, null);
                }
            }
        });
    });
})();
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