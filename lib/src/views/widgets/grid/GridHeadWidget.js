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
var _GridHeadWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { gridHeadWidget };
var gridHeadWidget = new (Widget({
    name: "gridhead"
})((_a = class GridHeadWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _GridHeadWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _GridHeadWidgetFactoryBase_template, element("thead", {
                attributes: {
                    class: "gridhead",
                    role: "rowgroup"
                }
            }), "f");
        }
        create() {
            return __classPrivateFieldGet(this, _GridHeadWidgetFactoryBase_template, "f").cloneNode(true);
        }
        slot(head) {
            return head;
        }
    },
    _GridHeadWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=GridHeadWidget.js.map