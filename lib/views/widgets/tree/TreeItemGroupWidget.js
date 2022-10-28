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
var _TreeItemGroupWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { treeItemWidget } from "./TreeItemWidget";
export { treeItemGroupWidget };
var treeItemGroupWidget = new (Widget({
    name: "treeitemgroup"
})((_a = class TreeItemGroupWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _TreeItemGroupWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _TreeItemGroupWidgetFactoryBase_template, element("ul", {
                attributes: {
                    class: "treeitemgroup",
                    role: "group"
                }
            }), "f");
        }
        create() {
            return __classPrivateFieldGet(this, _TreeItemGroupWidgetFactoryBase_template, "f").cloneNode(true);
        }
        slot(group) {
            return group;
        }
        slottedCallback(group, slot) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((child_i, i) => {
                if (child_i instanceof HTMLElement && child_i.classList.contains("treeitem")) {
                    treeItemWidget.setPosInSet(child_i, i);
                    treeItemWidget.setLevel(child_i, (() => {
                        let level = -1;
                        let closestItem = child_i;
                        while (closestItem !== null && closestItem.matches(".tree :scope")) {
                            closestItem = closestItem.parentElement?.closest(".treeitem") ?? null;
                            level++;
                        }
                        return level;
                    })());
                }
            });
        }
    },
    _TreeItemGroupWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=TreeItemGroupWidget.js.map