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
var _OptionWidgetFactoryBase_instances, _OptionWidgetFactoryBase_template, _OptionWidgetFactoryBase_label, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { optionWidget };
var optionWidget = new (Widget({
    name: "option"
})((_a = class OptionWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _OptionWidgetFactoryBase_instances.add(this);
            _OptionWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _OptionWidgetFactoryBase_template, element("span", {
                attributes: {
                    class: "option",
                    role: "option",
                    tabindex: -1
                },
                children: [
                    element("span", {
                        attributes: {
                            class: "label"
                        }
                    })
                ]
            }), "f");
        }
        create(properties) {
            const option = __classPrivateFieldGet(this, _OptionWidgetFactoryBase_template, "f").cloneNode(true);
            if (properties !== undefined) {
                const { label, name, value, disabled } = properties;
                let { selected } = properties;
                selected = selected ?? false;
                if (selected !== undefined) {
                    this.setSelected(option, selected);
                }
                if (label !== undefined) {
                    this.setLabel(option, label);
                }
                if (name !== undefined) {
                    this.setName(option, name);
                }
                if (value !== undefined) {
                    this.setValue(option, value);
                }
                if (disabled !== undefined) {
                    this.setDisabled(option, disabled);
                }
            }
            return option;
        }
        get observedAttributes() {
            return ["aria-selected"];
        }
        attributeChangedCallback(option, name, oldValue, newValue) {
            switch (name) {
                case "aria-selected": {
                    if (JSON.parse(newValue) === true) {
                        option.dispatchEvent(new Event("select", { bubbles: true }));
                    }
                }
            }
        }
        getLabel(option) {
            return __classPrivateFieldGet(this, _OptionWidgetFactoryBase_instances, "m", _OptionWidgetFactoryBase_label).call(this, option).textContent ?? "";
        }
        setLabel(option, value) {
            __classPrivateFieldGet(this, _OptionWidgetFactoryBase_instances, "m", _OptionWidgetFactoryBase_label).call(this, option).textContent = value;
        }
        getValue(option) {
            return option.getAttribute("value") ?? "";
        }
        setValue(option, value) {
            option.setAttribute("value", value);
        }
        getName(option) {
            return option.getAttribute("name") ?? "";
        }
        setName(option, value) {
            option.setAttribute("name", value);
        }
        getSelected(option) {
            return JSON.parse(option.getAttribute("aria-selected") ?? String(false));
        }
        setSelected(option, value) {
            option.setAttribute("aria-selected", String(value));
        }
        getDisabled(option) {
            return option.hasAttribute("aria-disabled");
        }
        setDisabled(option, value) {
            option.toggleAttribute("aria-disabled", value);
        }
    },
    _OptionWidgetFactoryBase_template = new WeakMap(),
    _OptionWidgetFactoryBase_instances = new WeakSet(),
    _OptionWidgetFactoryBase_label = function _OptionWidgetFactoryBase_label(option) {
        return option.querySelector(":scope > .label");
    },
    _a)));
//# sourceMappingURL=OptionWidget.js.map