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
var _GridHeaderWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { gridHeaderWidget };
var gridHeaderWidget = new (Widget({
    name: "gridheader"
})((_a = class GridHeaderWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _GridHeaderWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _GridHeaderWidgetFactoryBase_template, element("th", {
                attributes: {
                    class: "gridheader",
                    scope: "column",
                    role: "columnheader",
                    tabindex: -1
                }
            }), "f");
        }
        create(init) {
            const header = __classPrivateFieldGet(this, _GridHeaderWidgetFactoryBase_template, "f").cloneNode(true);
            if (init !== undefined) {
                const { id, classList, tabIndex } = init;
                if (id !== undefined) {
                    header.id = id;
                }
                if (classList !== undefined) {
                    header.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    header.tabIndex = tabIndex;
                }
            }
            return header;
        }
        slot(header) {
            return header;
        }
        setActive(item, value) {
            const { classList } = item;
            if (value) {
                classList.add("active");
            }
            else {
                classList.remove("active");
            }
        }
        getActive(item) {
            const { classList } = item;
            return classList.contains("active");
        }
    },
    _GridHeaderWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=GridHeaderWidget.js.map