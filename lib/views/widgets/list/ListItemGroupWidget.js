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
var _ListItemGroupWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { listItemWidget } from "./ListItemWidget";
export { listItemGroupWidget };
var listItemGroupWidget = new (Widget({
    name: "listitemgroup"
})((_a = class ListItemGroupWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _ListItemGroupWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _ListItemGroupWidgetFactoryBase_template, element("ul", {
                attributes: {
                    class: "listitemgroup",
                    role: "group"
                }
            }), "f");
        }
        create() {
            return __classPrivateFieldGet(this, _ListItemGroupWidgetFactoryBase_template, "f").cloneNode(true);
        }
        slot(group) {
            return group;
        }
        slottedCallback(group, slot) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((child_i, i) => {
                if (child_i instanceof HTMLElement && child_i.classList.contains("listitem")) {
                    listItemWidget.setPosInSet(child_i, i);
                }
            });
        }
    },
    _ListItemGroupWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=ListItemGroupWidget.js.map