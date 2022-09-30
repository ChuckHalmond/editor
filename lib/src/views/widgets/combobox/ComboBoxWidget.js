var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ComboBoxWidgetFactoryBase_instances, _ComboBoxWidgetFactoryBase_template, _ComboBoxWidgetFactoryBase_walker, _ComboBoxWidgetFactoryBase_optionsObserver, _ComboBoxWidgetFactoryBase_box, _ComboBoxWidgetFactoryBase_getActiveOption, _ComboBoxWidgetFactoryBase_value, _ComboBoxWidgetFactoryBase_optionsMutationCallback, _ComboBoxWidgetFactoryBase_walkerNodeFilter, _ComboBoxWidgetFactoryBase_firstOption, _ComboBoxWidgetFactoryBase_lastOption, _ComboBoxWidgetFactoryBase_previousOption, _ComboBoxWidgetFactoryBase_nextOption, _ComboBoxWidgetFactoryBase_selectOption, _ComboBoxWidgetFactoryBase_setSelectedOption, _ComboBoxWidgetFactoryBase_positionBox, _ComboBoxWidgetFactoryBase_handleClickEvent, _ComboBoxWidgetFactoryBase_handleFocusOutEvent, _ComboBoxWidgetFactoryBase_handleKeyDownEvent, _ComboBoxWidgetFactoryBase_handleMouseOverEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { optionWidget } from "./OptionWidget";
export { comboBoxWidget };
var comboBoxWidget = new (Widget({
    name: "combobox"
})((_a = class ComboBoxWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _ComboBoxWidgetFactoryBase_instances.add(this);
            _ComboBoxWidgetFactoryBase_template.set(this, void 0);
            _ComboBoxWidgetFactoryBase_walker.set(this, void 0);
            _ComboBoxWidgetFactoryBase_optionsObserver.set(this, void 0);
            __classPrivateFieldSet(this, _ComboBoxWidgetFactoryBase_walker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_walkerNodeFilter).bind(this)), "f");
            __classPrivateFieldSet(this, _ComboBoxWidgetFactoryBase_optionsObserver, new MutationObserver(__classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_optionsMutationCallback).bind(this)), "f");
            __classPrivateFieldSet(this, _ComboBoxWidgetFactoryBase_template, element("div", {
                attributes: {
                    class: "combobox",
                    role: "combobox",
                    tabindex: 0,
                },
                children: [
                    element("div", {
                        attributes: {
                            class: "content"
                        },
                        children: [
                            element("span", {
                                attributes: {
                                    class: "value"
                                }
                            })
                        ]
                    }),
                    element("div", {
                        attributes: {
                            class: "box"
                        }
                    })
                ]
            }), "f");
        }
        create(properties) {
            const combobox = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_template, "f").cloneNode(true);
            __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_optionsObserver, "f").observe(combobox, {
                childList: true,
                subtree: true
            });
            combobox.addEventListener("focusout", __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_handleFocusOutEvent).bind(this));
            combobox.addEventListener("keydown", __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_handleKeyDownEvent).bind(this));
            combobox.addEventListener("click", __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_handleClickEvent).bind(this));
            combobox.addEventListener("mouseover", __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_handleMouseOverEvent).bind(this));
            this.setExpanded(combobox, false);
            if (properties !== undefined) {
                const { id, classList, tabIndex, name, disabled, multiselectable } = properties;
                if (id !== undefined) {
                    combobox.id = id;
                }
                if (classList !== undefined) {
                    combobox.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    combobox.tabIndex = tabIndex;
                }
                if (name !== undefined) {
                    this.setName(combobox, name);
                }
                if (disabled !== undefined) {
                    this.setDisabled(combobox, disabled);
                }
                if (multiselectable !== undefined) {
                    this.setMultiSelectable(combobox, multiselectable);
                }
            }
            return combobox;
        }
        slot(combobox) {
            return __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_box).call(this, combobox);
        }
        slottedCallback(combobox, slot, name) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((child_i, i) => {
                if (child_i instanceof HTMLElement) {
                    //gridRowWidget.setPosInSet(child_i, i);
                }
            });
        }
        options(combobox) {
            return Array.from(combobox.querySelectorAll(":scope > :is(.box, .box > .optiongroup) > .option"));
        }
        selectedOption(combobox) {
            return combobox.querySelector(":scope > :is(.box, .box > .optiongroup) > .option[aria-selected=true]");
        }
        getName(combobox) {
            return combobox.getAttribute("name") ?? "";
        }
        setName(combobox, value) {
            combobox.setAttribute("name", value);
        }
        getDisabled(combobox) {
            return combobox.hasAttribute("aria-disabled");
        }
        setDisabled(combobox, value) {
            combobox.toggleAttribute("aria-disabled", value);
        }
        setExpanded(combobox, value) {
            combobox.setAttribute("aria-expanded", String(value));
        }
        getExpanded(combobox) {
            return JSON.parse(combobox.getAttribute("aria-expanded") ?? String(false));
        }
        setMultiSelectable(combobox, value) {
            combobox.setAttribute("aria-multiselectable", String(value));
        }
        getMultiSelectable(combobox) {
            return JSON.parse(combobox.getAttribute("aria-multiselectable") ?? String(false));
        }
        expand(combobox) {
            const expanded = this.getExpanded(combobox);
            if (!expanded) {
                this.setExpanded(combobox, true);
                __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_positionBox).call(this, combobox);
                const selectedOption = this.selectedOption(combobox);
                if (selectedOption) {
                    selectedOption.focus({ preventScroll: true });
                }
            }
        }
        collapse(combobox) {
            const expanded = this.getExpanded(combobox);
            if (expanded) {
                this.setExpanded(combobox, false);
                combobox.focus();
            }
        }
        toggle(combobox, force) {
            const expanded = this.getExpanded(combobox);
            const expand = force ?? !expanded;
            expand ? this.expand(combobox) : this.collapse(combobox);
        }
    },
    _ComboBoxWidgetFactoryBase_template = new WeakMap(),
    _ComboBoxWidgetFactoryBase_walker = new WeakMap(),
    _ComboBoxWidgetFactoryBase_optionsObserver = new WeakMap(),
    _ComboBoxWidgetFactoryBase_instances = new WeakSet(),
    _ComboBoxWidgetFactoryBase_box = function _ComboBoxWidgetFactoryBase_box(combobox) {
        return combobox.querySelector(":scope > .box");
    },
    _ComboBoxWidgetFactoryBase_getActiveOption = function _ComboBoxWidgetFactoryBase_getActiveOption(combobox) {
        return combobox.querySelector(":scope > :is(.box, .box > .optiongroup) > .option:focus-within");
    },
    _ComboBoxWidgetFactoryBase_value = function _ComboBoxWidgetFactoryBase_value(combobox) {
        return combobox.querySelector(":scope > .content > .value");
    },
    _ComboBoxWidgetFactoryBase_optionsMutationCallback = function _ComboBoxWidgetFactoryBase_optionsMutationCallback(mutationsList) {
        mutationsList.forEach((mutation) => {
            const { target, type } = mutation;
            const targetCombobox = target.closest(".combobox");
            if (targetCombobox instanceof HTMLElement) {
                switch (type) {
                    case "childList": {
                        const { addedNodes } = mutation;
                        const selector = ".option[aria-selected=true]";
                        for (let node of addedNodes) {
                            if (node instanceof HTMLElement) {
                                const selectedOption = node.matches(selector) ? node :
                                    node.querySelector(selector);
                                if (selectedOption) {
                                    __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_setSelectedOption).call(this, targetCombobox, selectedOption);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        });
    },
    _ComboBoxWidgetFactoryBase_walkerNodeFilter = function _ComboBoxWidgetFactoryBase_walkerNodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("option") && !optionWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("optiongroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _ComboBoxWidgetFactoryBase_firstOption = function _ComboBoxWidgetFactoryBase_firstOption(combobox) {
        const walker = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_walker, "f");
        walker.currentNode = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_box).call(this, combobox);
        return walker.firstChild();
    },
    _ComboBoxWidgetFactoryBase_lastOption = function _ComboBoxWidgetFactoryBase_lastOption(combobox) {
        const walker = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_walker, "f");
        walker.currentNode = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_box).call(this, combobox);
        return walker.lastChild();
    },
    _ComboBoxWidgetFactoryBase_previousOption = function _ComboBoxWidgetFactoryBase_previousOption(option) {
        const walker = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_walker, "f");
        walker.currentNode = option;
        return walker.previousNode();
    },
    _ComboBoxWidgetFactoryBase_nextOption = function _ComboBoxWidgetFactoryBase_nextOption(option) {
        const walker = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_walker, "f");
        walker.currentNode = option;
        return walker.nextNode();
    },
    _ComboBoxWidgetFactoryBase_selectOption = function _ComboBoxWidgetFactoryBase_selectOption(combobox, option) {
        const selectedOption = this.selectedOption(combobox);
        if (selectedOption) {
            optionWidget.setSelected(selectedOption, false);
        }
        if (option !== selectedOption) {
            optionWidget.setSelected(option, true);
            __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_setSelectedOption).call(this, combobox, option);
            combobox.dispatchEvent(new Event("change", { bubbles: true }));
        }
    },
    _ComboBoxWidgetFactoryBase_setSelectedOption = function _ComboBoxWidgetFactoryBase_setSelectedOption(combobox, option) {
        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_value).call(this, combobox).textContent = optionWidget.getLabel(option);
    },
    _ComboBoxWidgetFactoryBase_positionBox = function _ComboBoxWidgetFactoryBase_positionBox(combobox) {
        const box = combobox.querySelector(":scope > .box");
        const { style: optionsStyle } = box;
        const { bottom, left } = combobox.getBoundingClientRect();
        const { scrollX, scrollY } = window;
        optionsStyle.setProperty("top", `${bottom + scrollY}px`);
        optionsStyle.setProperty("left", `${left + scrollX}px`);
    },
    _ComboBoxWidgetFactoryBase_handleClickEvent = function _ComboBoxWidgetFactoryBase_handleClickEvent(event) {
        const { currentTarget, target } = event;
        const targetCombobox = currentTarget;
        this.toggle(targetCombobox);
        const expanded = this.getExpanded(targetCombobox);
        if (expanded) {
            const selectedOption = this.selectedOption(targetCombobox);
            (selectedOption ?? this.options(targetCombobox)[0])?.focus({ preventScroll: true });
        }
        else {
            const targetOption = target.closest(".option");
            if (targetOption) {
                __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_selectOption).call(this, targetCombobox, targetOption);
            }
        }
    },
    _ComboBoxWidgetFactoryBase_handleFocusOutEvent = function _ComboBoxWidgetFactoryBase_handleFocusOutEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetCombobox = currentTarget;
        const lostFocusWithin = !targetCombobox.contains(relatedTarget);
        if (lostFocusWithin) {
            this.collapse(targetCombobox);
        }
    },
    _ComboBoxWidgetFactoryBase_handleKeyDownEvent = function _ComboBoxWidgetFactoryBase_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetCombobox = currentTarget;
        const expanded = this.getExpanded(targetCombobox);
        const activeOption = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_getActiveOption).call(this, targetCombobox);
        const selectedOption = this.selectedOption(targetCombobox);
        switch (key) {
            case "ArrowUp": {
                if (expanded) {
                    const previousOption = activeOption ?
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_previousOption).call(this, activeOption) :
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_firstOption).call(this, targetCombobox);
                    if (previousOption) {
                        previousOption.focus({ preventScroll: true });
                    }
                }
                else {
                    const previousOption = selectedOption ?
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_previousOption).call(this, selectedOption) :
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_firstOption).call(this, targetCombobox);
                    if (previousOption) {
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_selectOption).call(this, targetCombobox, previousOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (expanded) {
                    const nextOption = activeOption ?
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_nextOption).call(this, activeOption) :
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_lastOption).call(this, targetCombobox);
                    if (nextOption) {
                        nextOption.focus({ preventScroll: true });
                    }
                }
                else {
                    const nextOption = selectedOption ?
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_nextOption).call(this, selectedOption) :
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_lastOption).call(this, targetCombobox);
                    if (nextOption) {
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_selectOption).call(this, targetCombobox, nextOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstOption = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_firstOption).call(this, targetCombobox);
                if (firstOption) {
                    if (expanded) {
                        firstOption.focus({ preventScroll: true });
                    }
                    else {
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_selectOption).call(this, targetCombobox, firstOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastOption = __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_lastOption).call(this, targetCombobox);
                if (lastOption) {
                    if (expanded) {
                        lastOption.focus({ preventScroll: true });
                    }
                    else {
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_selectOption).call(this, targetCombobox, lastOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (expanded) {
                    this.collapse(targetCombobox);
                    if (activeOption) {
                        __classPrivateFieldGet(this, _ComboBoxWidgetFactoryBase_instances, "m", _ComboBoxWidgetFactoryBase_selectOption).call(this, targetCombobox, activeOption);
                    }
                }
                else {
                    this.expand(targetCombobox);
                    selectedOption?.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.collapse(targetCombobox);
                }
                event.stopPropagation();
                break;
            }
            default: {
                const { length: keyLength } = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const options = this.options(targetCombobox);
                    const activeIndex = activeOption ? options.indexOf(activeOption) : -1;
                    const matchingOption = options.find((option_i, i) => optionWidget.getLabel(option_i).toLowerCase().charCodeAt(0) == keyCode && i > activeIndex) ?? options.find((option_i) => optionWidget.getLabel(option_i).toLowerCase().charCodeAt(0) == keyCode);
                    if (matchingOption) {
                        matchingOption.focus({ preventScroll: true });
                    }
                    event.stopPropagation();
                }
                break;
            }
        }
    },
    _ComboBoxWidgetFactoryBase_handleMouseOverEvent = function _ComboBoxWidgetFactoryBase_handleMouseOverEvent(event) {
        const { target } = event;
        const targetItem = target.closest(".option");
        if (targetItem) {
            targetItem.focus({ preventScroll: true });
        }
    },
    _a)));
//# sourceMappingURL=ComboBoxWidget.js.map