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
var _GridBodyWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { gridRowWidget } from "./GridRowWidget";
export { gridBodyWidget };
var gridBodyWidget = new (Widget({
    name: "gridbody"
})((_a = class GridBodyWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _GridBodyWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _GridBodyWidgetFactoryBase_template, element("tbody", {
                attributes: {
                    class: "gridbody",
                    role: "rowgroup"
                }
            }), "f");
        }
        create() {
            return __classPrivateFieldGet(this, _GridBodyWidgetFactoryBase_template, "f").cloneNode(true);
        }
        slot(body) {
            return body;
        }
        slottedCallback(body, slot) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((child_i, i) => {
                if (child_i instanceof HTMLElement && child_i.classList.contains("gridrow")) {
                    gridRowWidget.setPosInSet(child_i, i);
                }
            });
        }
    },
    _GridBodyWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=GridBodyWidget.js.map