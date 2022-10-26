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
var _ListItemWidgetFactoryBase_instances, _ListItemWidgetFactoryBase_template, _ListItemWidgetFactoryBase_label, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { listItemWidget };
var listItemWidget = new (Widget({
    name: "listitem"
})((_a = class ListItemWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _ListItemWidgetFactoryBase_instances.add(this);
            _ListItemWidgetFactoryBase_template.set(this, void 0);
            __classPrivateFieldSet(this, _ListItemWidgetFactoryBase_template, element("li", {
                attributes: {
                    class: "listitem",
                    role: "listitem",
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
        create(init) {
            const item = __classPrivateFieldGet(this, _ListItemWidgetFactoryBase_template, "f").cloneNode(true);
            if (init !== undefined) {
                const { label, disabled } = init;
                if (label !== undefined) {
                    this.setLabel(item, label);
                }
                if (disabled !== undefined) {
                    this.setDisabled(item, disabled);
                }
                this.setSelected(item, false);
            }
            return item;
        }
        slot(root) {
            return root;
        }
        group(item) {
            return item.querySelector(":scope > .listitemgroup");
        }
        getLabel(item) {
            return __classPrivateFieldGet(this, _ListItemWidgetFactoryBase_instances, "m", _ListItemWidgetFactoryBase_label).call(this, item).textContent ?? "";
        }
        setLabel(item, value) {
            __classPrivateFieldGet(this, _ListItemWidgetFactoryBase_instances, "m", _ListItemWidgetFactoryBase_label).call(this, item).textContent = value;
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
        setSelected(row, value) {
            row.setAttribute("aria-selected", String(value));
            row.dispatchEvent(new Event("select", { bubbles: true }));
        }
        getSelected(row) {
            return JSON.parse(row.getAttribute("aria-selected") ?? String(false));
        }
    },
    _ListItemWidgetFactoryBase_template = new WeakMap(),
    _ListItemWidgetFactoryBase_instances = new WeakSet(),
    _ListItemWidgetFactoryBase_label = function _ListItemWidgetFactoryBase_label(item) {
        return item.querySelector(":scope > .label");
    },
    _a)));
//# sourceMappingURL=ListItemWidget.js.map