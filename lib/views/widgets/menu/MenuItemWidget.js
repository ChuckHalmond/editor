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
var _MenuItemWidgetFactoryBase_instances, _MenuItemWidgetFactoryBase_iconPartTemplate, _MenuItemWidgetFactoryBase_arrowPartTemplate, _MenuItemWidgetFactoryBase_keyshortcutsPartTemplate, _MenuItemWidgetFactoryBase_template, _MenuItemWidgetFactoryBase_types, _MenuItemWidgetFactoryBase_typesFeatures, _MenuItemWidgetFactoryBase_label, _MenuItemWidgetFactoryBase_handleClickEvent, _MenuItemWidgetFactoryBase_positionMenu, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
export { menuItemWidget };
var menuItemWidget = new (Widget({
    name: "menuitem"
})((_a = class MenuItemWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _MenuItemWidgetFactoryBase_instances.add(this);
            _MenuItemWidgetFactoryBase_iconPartTemplate.set(this, void 0);
            _MenuItemWidgetFactoryBase_arrowPartTemplate.set(this, void 0);
            _MenuItemWidgetFactoryBase_keyshortcutsPartTemplate.set(this, void 0);
            _MenuItemWidgetFactoryBase_template.set(this, void 0);
            _MenuItemWidgetFactoryBase_types.set(this, void 0);
            _MenuItemWidgetFactoryBase_typesFeatures.set(this, void 0);
            __classPrivateFieldSet(this, _MenuItemWidgetFactoryBase_iconPartTemplate, element("span", {
                attributes: {
                    class: "icon"
                }
            }), "f");
            __classPrivateFieldSet(this, _MenuItemWidgetFactoryBase_arrowPartTemplate, element("span", {
                attributes: {
                    class: "arrow"
                }
            }), "f");
            __classPrivateFieldSet(this, _MenuItemWidgetFactoryBase_keyshortcutsPartTemplate, element("span", {
                attributes: {
                    class: "keyshortcuts"
                }
            }), "f");
            __classPrivateFieldSet(this, _MenuItemWidgetFactoryBase_template, element("button", {
                attributes: {
                    class: "menuitem",
                    role: "menuitem",
                    type: "button",
                    tabindex: -1
                },
                children: [
                    __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_iconPartTemplate, "f").cloneNode(true),
                    element("span", {
                        attributes: {
                            class: "label"
                        }
                    })
                ]
            }), "f");
            __classPrivateFieldSet(this, _MenuItemWidgetFactoryBase_types, ["checkbox", "radio", "menu", "submenu", "button"], "f");
            __classPrivateFieldSet(this, _MenuItemWidgetFactoryBase_typesFeatures, {
                button: {
                    role: "menuitem",
                    hasIcon: true,
                    hasArrow: false
                },
                checkbox: {
                    role: "menuitemcheckbox",
                    hasIcon: true,
                    hasArrow: false
                },
                radio: {
                    role: "menuitemradio",
                    hasIcon: true,
                    hasArrow: false
                },
                menu: {
                    role: "menuitem",
                    hasIcon: false,
                    hasArrow: false
                },
                submenu: {
                    role: "menuitem",
                    hasIcon: true,
                    hasArrow: true
                }
            }, "f");
        }
        create(init) {
            const item = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_template, "f").cloneNode(true);
            item.addEventListener("click", __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_handleClickEvent).bind(this));
            if (init !== undefined) {
                const { id, classList, tabIndex, keyshortcut, checked, type, label, name, value, disabled } = init;
                if (id !== undefined) {
                    item.id = id;
                }
                if (classList !== undefined) {
                    item.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    item.tabIndex = tabIndex;
                }
                if (keyshortcut !== undefined) {
                    this.setKeyShortcut(item, keyshortcut);
                }
                if (checked !== undefined) {
                    this.setChecked(item, checked);
                }
                if (type !== undefined) {
                    if (type == "menu" || type == "submenu") {
                        this.setExpanded(item, false);
                    }
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
        getMenu(item) {
            return item.querySelector(":scope > .menu");
        }
        getKeyShortcut(item) {
            return item.getAttribute("aria-keyshortcuts");
        }
        setKeyShortcut(item, value) {
            let keyshortcutsPart = item.querySelector(":scope > .keyshortcuts");
            if (value !== null) {
                item.setAttribute("aria-keyshortcuts", value);
                if (!keyshortcutsPart) {
                    const labelPart = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_label).call(this, item);
                    const keyshortcutsPartTemplate = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_keyshortcutsPartTemplate, "f");
                    keyshortcutsPart = keyshortcutsPartTemplate.cloneNode(true);
                    labelPart.after(keyshortcutsPart);
                }
                keyshortcutsPart.textContent = value;
            }
            else {
                item.removeAttribute("aria-keyshortcuts");
                if (keyshortcutsPart) {
                    keyshortcutsPart.remove();
                }
            }
        }
        getLabel(item) {
            return __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_label).call(this, item).textContent ?? "";
        }
        setLabel(item, value) {
            __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_label).call(this, item).textContent = value;
        }
        getType(item) {
            const types = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_types, "f");
            const { classList } = item;
            for (let type_i of types) {
                if (classList.contains(`menuitem-${type_i}`)) {
                    return type_i;
                }
            }
            return null;
        }
        setType(item, type) {
            const typesFeatures = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_typesFeatures, "f");
            const iconPartTemplate = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_iconPartTemplate, "f");
            const arrowPartTemplate = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_arrowPartTemplate, "f");
            const { role, hasIcon, hasArrow } = typesFeatures[type];
            const oldType = this.getType(item);
            const { classList } = item;
            if (oldType) {
                classList.remove(`menuitem-${oldType}`);
            }
            classList.add(`menuitem-${type}`);
            item.setAttribute("role", role);
            const labelPart = __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_label).call(this, item);
            const iconPart = item.querySelector(":scope > .icon");
            const arrowPart = item.querySelector(":scope > .arrow");
            if (hasIcon) {
                if (!iconPart && labelPart) {
                    labelPart.before(iconPartTemplate.cloneNode(true));
                }
            }
            else {
                if (iconPart) {
                    iconPart.remove();
                }
            }
            if (hasArrow) {
                if (!arrowPart && labelPart) {
                    labelPart.after(arrowPartTemplate.cloneNode(true));
                }
            }
            else {
                if (arrowPart) {
                    arrowPart.remove();
                }
            }
        }
        getValue(item) {
            return item.getAttribute("value") ?? "";
        }
        setValue(item, value) {
            item.setAttribute("value", value);
        }
        getName(item) {
            return item.getAttribute("name") ?? "";
        }
        setName(item, value) {
            item.setAttribute("name", value);
        }
        getChecked(item) {
            return JSON.parse(item.getAttribute("aria-checked") ?? String(false));
        }
        setChecked(item, value) {
            item.setAttribute("aria-checked", String(value));
        }
        getDisabled(item) {
            return item.hasAttribute("aria-disabled");
        }
        setDisabled(item, value) {
            item.toggleAttribute("aria-disabled", value);
        }
        setExpanded(item, value) {
            item.setAttribute("aria-expanded", String(value));
        }
        getExpanded(item) {
            return JSON.parse(item.getAttribute("aria-expanded") ?? String(false));
        }
        toggle(item, force) {
            const expand = force ?? !this.getExpanded(item);
            this.setExpanded(item, expand);
            if (expand) {
                __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_positionMenu).call(this, item);
            }
        }
        expand(item) {
            const expanded = this.getExpanded(item);
            if (!expanded) {
                this.setExpanded(item, true);
                __classPrivateFieldGet(this, _MenuItemWidgetFactoryBase_instances, "m", _MenuItemWidgetFactoryBase_positionMenu).call(this, item);
            }
        }
        collapse(item) {
            const expanded = this.getExpanded(item);
            if (expanded) {
                this.setExpanded(item, false);
            }
        }
    },
    _MenuItemWidgetFactoryBase_iconPartTemplate = new WeakMap(),
    _MenuItemWidgetFactoryBase_arrowPartTemplate = new WeakMap(),
    _MenuItemWidgetFactoryBase_keyshortcutsPartTemplate = new WeakMap(),
    _MenuItemWidgetFactoryBase_template = new WeakMap(),
    _MenuItemWidgetFactoryBase_types = new WeakMap(),
    _MenuItemWidgetFactoryBase_typesFeatures = new WeakMap(),
    _MenuItemWidgetFactoryBase_instances = new WeakSet(),
    _MenuItemWidgetFactoryBase_label = function _MenuItemWidgetFactoryBase_label(item) {
        return item.querySelector(":scope > .label");
    },
    _MenuItemWidgetFactoryBase_handleClickEvent = function _MenuItemWidgetFactoryBase_handleClickEvent(event) {
        const { target, currentTarget } = event;
        const targetItem = target.closest(".menuitem");
        if (targetItem == currentTarget) {
            const type = this.getType(targetItem);
            switch (type) {
                case "checkbox": {
                    this.setChecked(targetItem, !this.getChecked(targetItem));
                    break;
                }
                case "radio": {
                    this.setChecked(targetItem, true);
                    break;
                }
                case "menu":
                case "submenu": {
                    this.toggle(targetItem);
                    if (this.getExpanded(targetItem)) {
                        this.getMenu(targetItem)?.focus({ preventScroll: true });
                    }
                    break;
                }
            }
        }
    },
    _MenuItemWidgetFactoryBase_positionMenu = function _MenuItemWidgetFactoryBase_positionMenu(item) {
        const menu = this.getMenu(item);
        if (menu !== null) {
            const { style: menuStyle } = menu;
            const { top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight } = item.getBoundingClientRect();
            const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
            const { scrollY, scrollX } = window;
            const { clientWidth, clientHeight } = document.body;
            const type = this.getType(item);
            if (type == "menu") {
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${overflowX > 0 ?
                    scrollX + itemLeft - menuWidth :
                    scrollX + itemLeft}px`);
                menuStyle.setProperty("top", `${overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom}px`);
            }
            else {
                const closestMenu = item.closest(".menu");
                if (closestMenu !== null) {
                    const { top: closestMenuTop, left: closestMenuLeft } = closestMenu.getBoundingClientRect();
                    const overflowX = itemRight + menuWidth - clientWidth;
                    const overflowY = itemTop + menuHeight - clientHeight;
                    menuStyle.setProperty("left", `${overflowX > 0 ?
                        itemLeft - menuWidth - closestMenuLeft :
                        itemRight - closestMenuLeft}px`);
                    const menuComputedStyle = window.getComputedStyle(menu);
                    const { paddingTop, paddingBottom } = menuComputedStyle;
                    const menuPaddingTop = parseFloat(paddingTop);
                    const menuPaddingBottom = parseFloat(paddingBottom);
                    menuStyle.setProperty("top", `${overflowY > 0 ?
                        itemBottom - menuHeight - closestMenuTop + menuPaddingBottom :
                        itemTop - closestMenuTop - menuPaddingTop}px`);
                }
            }
        }
    },
    _a)));
//# sourceMappingURL=MenuItemWidget.js.map