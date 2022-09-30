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
var _GridCellWidgetFactoryBase_instances, _GridCellWidgetFactoryBase_template, _GridCellWidgetFactoryBase_label, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { gridCellWidget };
var gridCellWidget = new (Widget({
    name: "gridcell"
})((_a = class GridCellWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _GridCellWidgetFactoryBase_instances.add(this);
            _GridCellWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _GridCellWidgetFactoryBase_template, element("td", {
                attributes: {
                    class: "gridcell",
                    role: "gridcell",
                    tabindex: -1
                }
            }), "f");
        }
        create(init) {
            const cell = __classPrivateFieldGet(this, _GridCellWidgetFactoryBase_template, "f").cloneNode(true);
            if (init !== undefined) {
                const { id, classList, tabIndex, disabled, headers } = init;
                if (id !== undefined) {
                    cell.id = id;
                }
                if (classList !== undefined) {
                    cell.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    cell.tabIndex = tabIndex;
                }
                if (disabled !== undefined) {
                    this.setDisabled(cell, disabled);
                }
                if (headers !== undefined) {
                    this.setHeaders(cell, headers);
                }
                this.setSelected(cell, false);
            }
            return cell;
        }
        slot(cell) {
            return cell;
        }
        getHeaders(item) {
            return item.getAttribute("headers") ?? "";
        }
        setHeaders(item, value) {
            item.setAttribute("headers", value);
        }
        getLabel(item) {
            return __classPrivateFieldGet(this, _GridCellWidgetFactoryBase_instances, "m", _GridCellWidgetFactoryBase_label).call(this, item).textContent ?? "";
        }
        setLabel(item, value) {
            __classPrivateFieldGet(this, _GridCellWidgetFactoryBase_instances, "m", _GridCellWidgetFactoryBase_label).call(this, item).textContent = value;
        }
        setPosInSet(item, value) {
            item.setAttribute("aria-posinset", String(value));
        }
        getPosInSet(item) {
            const posInSet = item.getAttribute("aria-posinset");
            return posInSet ? parseInt(posInSet) : -1;
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
        setDropTarget(item, value) {
            const { classList } = item;
            if (value) {
                classList.add("droptarget");
            }
            else {
                classList.remove("droptarget");
            }
        }
        getDropTarget(item) {
            const { classList } = item;
            return classList.contains("droptarget");
        }
        setDisabled(item, value) {
            item.toggleAttribute("aria-disabled", value);
        }
        getDisabled(item) {
            return item.hasAttribute("aria-disabled");
        }
        setSelected(item, value) {
            item.setAttribute("aria-selected", String(value));
            item.dispatchEvent(new Event("select", { bubbles: true }));
        }
        getSelected(item) {
            return JSON.parse(item.getAttribute("aria-selected") ?? String(false));
        }
    },
    _GridCellWidgetFactoryBase_template = new WeakMap(),
    _GridCellWidgetFactoryBase_instances = new WeakSet(),
    _GridCellWidgetFactoryBase_label = function _GridCellWidgetFactoryBase_label(item) {
        return item.querySelector(":scope > .content > .label");
    },
    _a)));
//# sourceMappingURL=GridCellWidget.js.map