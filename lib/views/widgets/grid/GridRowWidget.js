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
var _GridRowWidgetFactoryBase_template, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { gridCellWidget } from "./GridCellWidget";
export { gridRowWidget };
var gridRowWidget = new (Widget({
    name: "gridrow"
})((_a = class GridRowWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _GridRowWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _GridRowWidgetFactoryBase_template, element("tr", {
                attributes: {
                    class: "gridrow",
                    role: "row",
                    tabindex: -1
                }
            }), "f");
        }
        create(init) {
            const row = __classPrivateFieldGet(this, _GridRowWidgetFactoryBase_template, "f").cloneNode(true);
            if (init !== undefined) {
                const { disabled } = init;
                if (disabled !== undefined) {
                    this.setDisabled(row, disabled);
                }
                this.setSelected(row, false);
            }
            return row;
        }
        slot(row) {
            return row;
        }
        cells(row) {
            return Array.from(row.querySelectorAll(":scope > .gridcell"));
        }
        setPosInSet(row, value) {
            row.setAttribute("aria-posinset", String(value));
        }
        getPosInSet(row) {
            const posInSet = row.getAttribute("aria-posinset");
            return posInSet ? parseInt(posInSet) : -1;
        }
        setActive(row, value) {
            const { classList } = row;
            if (value) {
                classList.add("active");
            }
            else {
                classList.remove("active");
            }
        }
        getActive(row) {
            const { classList } = row;
            return classList.contains("active");
        }
        setDropTarget(row, value) {
            const { classList } = row;
            if (value) {
                classList.add("droptarget");
            }
            else {
                classList.remove("droptarget");
            }
        }
        getDropTarget(row) {
            const { classList } = row;
            return classList.contains("droptarget");
        }
        setDisabled(row, value) {
            row.toggleAttribute("aria-disabled", value);
        }
        getDisabled(row) {
            return row.hasAttribute("aria-disabled");
        }
        setSelected(row, value) {
            row.setAttribute("aria-selected", String(value));
            row.dispatchEvent(new Event("select", { bubbles: true }));
        }
        getSelected(row) {
            return JSON.parse(row.getAttribute("aria-selected") ?? String(false));
        }
        slottedCallback(item, slot) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((item_i, i) => {
                if (item_i instanceof HTMLElement) {
                    gridCellWidget.setPosInSet(item_i, i);
                }
            });
        }
    },
    _GridRowWidgetFactoryBase_template = new WeakMap(),
    _a)));
//# sourceMappingURL=GridRowWidget.js.map