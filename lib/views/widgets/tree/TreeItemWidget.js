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
var _TreeItemWidgetFactoryBase_instances, _TreeItemWidgetFactoryBase_template, _TreeItemWidgetFactoryBase_types, _TreeItemWidgetFactoryBase_content, _TreeItemWidgetFactoryBase_handleClickEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { treeItemWidget };
var treeItemWidget = new (Widget({
    name: "treeitem"
})((_a = class TreeItemWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _TreeItemWidgetFactoryBase_instances.add(this);
            _TreeItemWidgetFactoryBase_template.set(this, void 0);
            _TreeItemWidgetFactoryBase_types.set(this, void 0);
            __classPrivateFieldSet(this, _TreeItemWidgetFactoryBase_types, ["parent", "leaf"], "f");
            __classPrivateFieldSet(this, _TreeItemWidgetFactoryBase_template, element("li", {
                attributes: {
                    class: "treeitem",
                    role: "treeitem",
                    tabindex: -1
                },
                children: [
                    element("span", {
                        attributes: {
                            class: "content"
                        },
                        children: [
                            element("span", {
                                attributes: {
                                    class: "arrow"
                                }
                            })
                        ]
                    })
                ]
            }), "f");
        }
        group(item) {
            return item.querySelector(":scope > .treeitemgroup");
        }
        create(properties) {
            const item = __classPrivateFieldGet(this, _TreeItemWidgetFactoryBase_template, "f").cloneNode(true);
            item.addEventListener("click", __classPrivateFieldGet(this, _TreeItemWidgetFactoryBase_instances, "m", _TreeItemWidgetFactoryBase_handleClickEvent).bind(this));
            if (properties !== undefined) {
                const { id, classList, tabIndex, label, title, type = "leaf", disabled, draggable } = properties;
                if (id !== undefined) {
                    item.id = id;
                }
                if (classList !== undefined) {
                    item.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    item.tabIndex = tabIndex;
                }
                if (label !== undefined) {
                    this.setLabel(item, label);
                }
                if (title !== undefined) {
                    this.setTitle(item, title);
                }
                this.setType(item, type);
                if (type === "parent") {
                    this.setExpanded(item, false);
                }
                if (disabled !== undefined) {
                    this.setDisabled(item, disabled);
                }
                if (draggable !== undefined) {
                    this.setDraggable(item, draggable);
                }
                this.setSelected(item, false);
            }
            return item;
        }
        get observedSlots() {
            return ["content", "group"];
        }
        slot(item, name) {
            switch (name) {
                case "content":
                    return __classPrivateFieldGet(this, _TreeItemWidgetFactoryBase_instances, "m", _TreeItemWidgetFactoryBase_content).call(this, item);
                case "group":
                    return item;
            }
            return null;
        }
        getLabel(item) {
            return item.getAttribute("aria-label") ?? "";
        }
        setLabel(item, value) {
            item.setAttribute("aria-label", value);
        }
        getTitle(item) {
            return item.title;
        }
        setTitle(item, value) {
            item.title = value;
        }
        setPosInSet(item, value) {
            item.setAttribute("aria-posinset", String(value));
        }
        getPosInSet(item) {
            const posInSet = item.getAttribute("aria-posinset");
            return posInSet ? Number(posInSet) : -1;
        }
        getType(item) {
            const types = __classPrivateFieldGet(this, _TreeItemWidgetFactoryBase_types, "f");
            const { classList } = item;
            for (let type_i of types) {
                if (classList.contains(`treeitem-${type_i}`)) {
                    return type_i;
                }
            }
            throw new Error("Missing type.");
        }
        setType(item, type) {
            const { classList } = item;
            try {
                const oldType = this.getType(item);
                classList.remove(`treeitem-${oldType}`);
            }
            catch (e) { }
            ;
            classList.add(`treeitem-${type}`);
        }
        setExpanded(item, value) {
            item.setAttribute("aria-expanded", String(value));
        }
        getExpanded(item) {
            return JSON.parse(item.getAttribute("aria-expanded") ?? String(false));
        }
        setActive(item, value) {
            const { classList } = item;
            if (value) {
                if (!classList.contains("active")) {
                    classList.add("active");
                }
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
        setDraggable(item, value) {
            item.setAttribute("draggable", String(value));
        }
        getDraggable(item) {
            return JSON.parse(item.getAttribute("draggable") ?? String(false));
        }
        setSelected(item, value) {
            item.setAttribute("aria-selected", String(value));
            item.dispatchEvent(new Event("select", { bubbles: true }));
        }
        getSelected(item) {
            return JSON.parse(item.getAttribute("aria-selected") ?? String(false));
        }
        setLevel(item, value) {
            item.style.setProperty("--level", String(value));
        }
        getLevel(item) {
            return parseInt(item.style.getPropertyValue("--level"));
        }
        toggle(item, force) {
            this.setExpanded(item, force ?? !this.getExpanded(item));
        }
    },
    _TreeItemWidgetFactoryBase_template = new WeakMap(),
    _TreeItemWidgetFactoryBase_types = new WeakMap(),
    _TreeItemWidgetFactoryBase_instances = new WeakSet(),
    _TreeItemWidgetFactoryBase_content = function _TreeItemWidgetFactoryBase_content(item) {
        const content = item.querySelector(":scope > .content");
        if (!content)
            throw new Error("Missing .content slot.");
        return content;
    },
    _TreeItemWidgetFactoryBase_handleClickEvent = function _TreeItemWidgetFactoryBase_handleClickEvent(event) {
        const { target, currentTarget, shiftKey, ctrlKey } = event;
        const targetItem = target.closest(".treeitem");
        if (targetItem == currentTarget) {
            const type = this.getType(targetItem);
            if (type == "parent" && !(shiftKey || ctrlKey)) {
                this.toggle(targetItem);
            }
        }
    },
    _a)));
//# sourceMappingURL=TreeItemWidget.js.map