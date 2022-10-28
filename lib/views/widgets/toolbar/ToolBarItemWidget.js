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
var _ToolBarItemWidgetFactoryBase_instances, _ToolBarItemWidgetFactoryBase_template, _ToolBarItemWidgetFactoryBase_types, _ToolBarItemWidgetFactoryBase_handleFocusOutEvent, _ToolBarItemWidgetFactoryBase_handleClickEvent, _ToolBarItemWidgetFactoryBase_positionMenu, _ToolBarItemWidgetFactoryBase_label, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { toolbarItemWidget };
var toolbarItemWidget = new (Widget({
    name: "toolbaritem"
})((_a = class ToolBarItemWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _ToolBarItemWidgetFactoryBase_instances.add(this);
            _ToolBarItemWidgetFactoryBase_template.set(this, void 0);
            _ToolBarItemWidgetFactoryBase_types.set(this, void 0);
            __classPrivateFieldSet(this, _ToolBarItemWidgetFactoryBase_types, ["button", "checkbox", "radio", "menubutton"], "f");
            __classPrivateFieldSet(this, _ToolBarItemWidgetFactoryBase_template, element("button", {
                attributes: {
                    class: "toolbaritem",
                    role: "button",
                    type: "button",
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
            const item = __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_template, "f").cloneNode(true);
            item.addEventListener("focusout", __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_instances, "m", _ToolBarItemWidgetFactoryBase_handleFocusOutEvent).bind(this));
            item.addEventListener("click", __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_instances, "m", _ToolBarItemWidgetFactoryBase_handleClickEvent).bind(this));
            if (init !== void 0) {
                const { id, keyshortcut, pressed, type, label, name, value, disabled } = init;
                if (id !== undefined) {
                    item.id = id;
                }
                if (keyshortcut !== undefined) {
                    this.setKeyShortcut(item, keyshortcut);
                }
                if (pressed !== undefined) {
                    this.setPressed(item, pressed);
                }
                if (type !== undefined) {
                    this.setType(item, type);
                }
                if (label !== undefined) {
                    this.setLabel(item, label);
                }
                if (name !== undefined) {
                    this.setName(item, name);
                }
                if (value !== undefined) {
                    this.setValue(item, value);
                }
                if (disabled !== undefined) {
                    this.setDisabled(item, disabled);
                }
            }
            return item;
        }
        slot(item) {
            return item;
        }
        slottedCallback(item, slot) {
            const hasChildMenu = Array.from(slot.childNodes).some(childNode_i => childNode_i instanceof HTMLElement && childNode_i.classList.contains("menu"));
            item.setAttribute("aria-haspopup", String(hasChildMenu));
        }
        menu(item) {
            return item.querySelector(":scope > .menu");
        }
        setExpanded(item, value) {
            item.toggleAttribute("aria-expanded", value);
        }
        getExpanded(item) {
            return item.hasAttribute("aria-expanded");
        }
        getLabel(item) {
            return __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_instances, "m", _ToolBarItemWidgetFactoryBase_label).call(this, item).textContent ?? "";
        }
        setLabel(item, value) {
            __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_instances, "m", _ToolBarItemWidgetFactoryBase_label).call(this, item).textContent = value;
        }
        getKeyShortcut(item) {
            return item.getAttribute("aria-keyshortcuts");
        }
        setKeyShortcut(item, value) {
            if (value !== null) {
                item.setAttribute("aria-keyshortcuts", value);
            }
            else {
                item.removeAttribute("aria-keyshortcuts");
            }
        }
        toggle(item, force) {
            const expand = force ?? !this.getExpanded(item);
            this.setExpanded(item, expand);
            if (expand) {
                __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_instances, "m", _ToolBarItemWidgetFactoryBase_positionMenu).call(this, item);
            }
        }
        expand(item) {
            const expanded = this.getExpanded(item);
            if (!expanded) {
                this.setExpanded(item, true);
                __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_instances, "m", _ToolBarItemWidgetFactoryBase_positionMenu).call(this, item);
            }
        }
        collapse(item) {
            const expanded = this.getExpanded(item);
            if (expanded) {
                this.setExpanded(item, false);
            }
        }
        getType(item) {
            const types = __classPrivateFieldGet(this, _ToolBarItemWidgetFactoryBase_types, "f");
            const { classList } = item;
            for (let type_i of types) {
                if (classList.contains(`toolbaritem-${type_i}`)) {
                    return type_i;
                }
            }
            return null;
        }
        setType(item, type) {
            const oldType = this.getType(item);
            if (type !== oldType) {
                const { classList } = item;
                if (oldType) {
                    classList.remove(`toolbaritem-${oldType}`);
                }
                classList.add(`toolbaritem-${type}`);
            }
        }
        getValue(item) {
            return item.getAttribute("value") ?? "";
        }
        setValue(item, value) {
            item.setAttribute("value", value);
        }
        getTitle(item) {
            return item.getAttribute("title") ?? "";
        }
        setTitle(item, value) {
            item.setAttribute("title", value);
        }
        getName(item) {
            return item.getAttribute("name") ?? "";
        }
        setName(item, value) {
            item.setAttribute("name", value);
        }
        getPressed(item) {
            return JSON.parse(item.getAttribute("aria-pressed") ?? String(false));
        }
        setPressed(item, value) {
            item.setAttribute("aria-pressed", String(value));
        }
        getDisabled(item) {
            return item.hasAttribute("aria-disabled");
        }
        setDisabled(item, value) {
            item.toggleAttribute("aria-disabled", value);
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
    _ToolBarItemWidgetFactoryBase_template = new WeakMap(),
    _ToolBarItemWidgetFactoryBase_types = new WeakMap(),
    _ToolBarItemWidgetFactoryBase_instances = new WeakSet(),
    _ToolBarItemWidgetFactoryBase_handleFocusOutEvent = function _ToolBarItemWidgetFactoryBase_handleFocusOutEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetItem = currentTarget;
        const lostFocusWithin = !targetItem.contains(relatedTarget);
        if (lostFocusWithin) {
            this.collapse(targetItem);
        }
    },
    _ToolBarItemWidgetFactoryBase_handleClickEvent = function _ToolBarItemWidgetFactoryBase_handleClickEvent(event) {
        const { target, currentTarget } = event;
        const targetItem = target.closest(".toolbaritem");
        if (targetItem == currentTarget) {
            const type = this.getType(targetItem);
            switch (type) {
                case "checkbox": {
                    this.setPressed(targetItem, !this.getPressed(targetItem));
                    break;
                }
                case "radio": {
                    this.setPressed(targetItem, true);
                    break;
                }
                case "menubutton": {
                    const menu = this.menu(targetItem);
                    if (menu && !menu.contains(target)) {
                        this.toggle(targetItem);
                        const expanded = this.getExpanded(targetItem);
                        if (expanded) {
                            menu?.focus({ preventScroll: true });
                        }
                    }
                    break;
                }
            }
        }
    },
    _ToolBarItemWidgetFactoryBase_positionMenu = function _ToolBarItemWidgetFactoryBase_positionMenu(item) {
        const type = this.getType(item);
        if (type == "menubutton") {
            const menu = this.menu(item);
            if (menu !== null) {
                const { style: menuStyle } = menu;
                const { top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight } = item.getBoundingClientRect();
                const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
                const { scrollY, scrollX } = window;
                const { clientWidth, clientHeight } = document.body;
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${overflowX > 0 ?
                    scrollX + itemLeft - menuWidth :
                    scrollX + itemLeft}px`);
                menuStyle.setProperty("top", `${overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom}px`);
            }
        }
    },
    _ToolBarItemWidgetFactoryBase_label = function _ToolBarItemWidgetFactoryBase_label(item) {
        return item.querySelector(":scope > .label");
    },
    _a)));
//# sourceMappingURL=ToolBarItemWidget.js.map