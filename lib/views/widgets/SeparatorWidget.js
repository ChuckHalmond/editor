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
var _SeparatorWidgetFactory_template, _a;
import { element } from "../../elements/Element";
import { Widget, WidgetFactory } from "./Widget";
export { separatorWidget };
var separatorWidget = new (Widget({
    name: "separator"
})((_a = class SeparatorWidgetFactory extends WidgetFactory {
        constructor() {
            super();
            _SeparatorWidgetFactory_template.set(this, void 0);
            __classPrivateFieldSet(this, _SeparatorWidgetFactory_template, element("div", {
                attributes: {
                    class: "separator",
                    role: "separator"
                }
            }), "f");
        }
        create() {
            return __classPrivateFieldGet(this, _SeparatorWidgetFactory_template, "f").cloneNode(true);
        }
    },
    _SeparatorWidgetFactory_template = new WeakMap(),
    _a)));
//# sourceMappingURL=SeparatorWidget.js.map