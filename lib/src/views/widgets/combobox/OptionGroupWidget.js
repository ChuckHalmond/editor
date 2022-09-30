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
var _OptionGroupWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { optionGroupWidget };
var optionGroupWidget = new (Widget({
    name: "optiongroup"
})((_a = class OptionGroupWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _OptionGroupWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _OptionGroupWidgetFactoryBase_template, element("ul", {
                attributes: {
                    class: "optiongroup",
                    role: "group"
                }
            }), "f");
        }
        create() {
            return __classPrivateFieldGet(this, _OptionGroupWidgetFactoryBase_template, "f").cloneNode(true);
        }
        slot(group) {
            return group;
        }
    },
    _OptionGroupWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=OptionGroupWidget.js.map