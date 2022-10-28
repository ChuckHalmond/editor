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
var _MenuWidgetFactoryBase_instances, _MenuWidgetFactoryBase_template, _MenuWidgetFactoryBase_walker, _MenuWidgetFactoryBase_toggleTimeouts, _MenuWidgetFactoryBase_walkerNodeFilter, _MenuWidgetFactoryBase_collapseSubmenus, _MenuWidgetFactoryBase_isClosestMenu, _MenuWidgetFactoryBase_nearestItem, _MenuWidgetFactoryBase_firstItem, _MenuWidgetFactoryBase_lastItem, _MenuWidgetFactoryBase_previousItem, _MenuWidgetFactoryBase_nextItem, _MenuWidgetFactoryBase_firstChildItem, _MenuWidgetFactoryBase_getActiveItem, _MenuWidgetFactoryBase_setItemTimeout, _MenuWidgetFactoryBase_clearItemTimeout, _MenuWidgetFactoryBase_handleClickEvent, _MenuWidgetFactoryBase_handleFocusOutEvent, _MenuWidgetFactoryBase_handleKeyDownEvent, _MenuWidgetFactoryBase_handleMouseOutEvent, _MenuWidgetFactoryBase_handleMouseOverEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { menuItemWidget } from "./MenuItemWidget";
export { menuWidget };
var mouseOverExpandDelay = 200;
var mouseOutCollapseDelay = 400;
var menuWidget = new (Widget({
    name: "menu"
})((_a = class MenuWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _MenuWidgetFactoryBase_instances.add(this);
            _MenuWidgetFactoryBase_template.set(this, void 0);
            _MenuWidgetFactoryBase_walker.set(this, void 0);
            _MenuWidgetFactoryBase_toggleTimeouts.set(this, void 0);
            __classPrivateFieldSet(this, _MenuWidgetFactoryBase_template, element("div", {
                attributes: {
                    class: "menu",
                    role: "menu",
                    tabindex: -1
                }
            }), "f");
            __classPrivateFieldSet(this, _MenuWidgetFactoryBase_walker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_walkerNodeFilter).bind(this)), "f");
            __classPrivateFieldSet(this, _MenuWidgetFactoryBase_toggleTimeouts, new WeakMap(), "f");
        }
        create(properties) {
            const menu = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_template, "f").cloneNode(true);
            menu.addEventListener("click", __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_handleClickEvent).bind(this));
            menu.addEventListener("mouseover", __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_handleMouseOverEvent).bind(this));
            menu.addEventListener("mouseout", __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_handleMouseOutEvent).bind(this));
            menu.addEventListener("focusout", __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_handleFocusOutEvent).bind(this));
            menu.addEventListener("keydown", __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_handleKeyDownEvent).bind(this));
            if (properties !== undefined) {
                const { id, classList, tabIndex, contextual, position } = properties;
                if (id !== undefined) {
                    menu.id = id;
                }
                if (classList !== undefined) {
                    menu.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    menu.tabIndex = tabIndex;
                }
                if (contextual !== undefined) {
                    this.setContextual(menu, contextual);
                }
                if (position !== undefined) {
                    const { x, y } = position;
                    this.setPosition(menu, x, y);
                }
            }
            return menu;
        }
        slot(menu) {
            return menu;
        }
        setPosition(menu, x, y) {
            const { style } = menu;
            const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
            const { scrollX, scrollY } = window;
            const left = x + scrollX;
            const top = y + scrollY;
            const { clientWidth, clientHeight } = document.body;
            const overflowX = left + menuWidth - clientWidth;
            const overflowY = top + menuHeight - clientHeight;
            style.setProperty("left", `${overflowX > 0 ? left - menuWidth : left}px`);
            style.setProperty("top", `${overflowY > 0 ? top - menuHeight : top}px`);
        }
        getContextual(menu) {
            const { classList } = menu;
            return classList.contains("menu-contextual");
        }
        setContextual(menu, value) {
            const { classList } = menu;
            if (value) {
                classList.add("menu-contextual");
            }
            else {
                classList.remove("menu-contextual");
            }
        }
        items(menu) {
            return Array.from(menu.querySelectorAll(":is(:scope, :scope > .menuitemgroup) > .menuitem"));
        }
    },
    _MenuWidgetFactoryBase_template = new WeakMap(),
    _MenuWidgetFactoryBase_walker = new WeakMap(),
    _MenuWidgetFactoryBase_toggleTimeouts = new WeakMap(),
    _MenuWidgetFactoryBase_instances = new WeakSet(),
    _MenuWidgetFactoryBase_walkerNodeFilter = function _MenuWidgetFactoryBase_walkerNodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("menuitem") && !menuItemWidget.getDisabled(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("menuitemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _MenuWidgetFactoryBase_collapseSubmenus = function _MenuWidgetFactoryBase_collapseSubmenus(menu) {
        menu.querySelectorAll(":is(:scope, :scope > .menuitemgroup) > .menuitem[aria-expanded]")
            .forEach(menuitem_i => menuItemWidget.collapse(menuitem_i));
    },
    _MenuWidgetFactoryBase_isClosestMenu = function _MenuWidgetFactoryBase_isClosestMenu(menu, target) {
        return target.closest(".menu") == menu;
    },
    _MenuWidgetFactoryBase_nearestItem = function _MenuWidgetFactoryBase_nearestItem(menu, target) {
        return Array.from(menu.querySelectorAll(":is(:scope, :scope > .menuitemgroup) > .menuitem")).find(item_i => item_i.contains(target)) ?? null;
    },
    _MenuWidgetFactoryBase_firstItem = function _MenuWidgetFactoryBase_firstItem(menu) {
        const walker = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_walker, "f");
        walker.currentNode = menu;
        return walker.firstChild();
    },
    _MenuWidgetFactoryBase_lastItem = function _MenuWidgetFactoryBase_lastItem(menu) {
        const walker = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_walker, "f");
        walker.currentNode = menu;
        return walker.lastChild();
    },
    _MenuWidgetFactoryBase_previousItem = function _MenuWidgetFactoryBase_previousItem(item) {
        const walker = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        return walker.previousSibling();
    },
    _MenuWidgetFactoryBase_nextItem = function _MenuWidgetFactoryBase_nextItem(item) {
        const walker = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        return walker.nextSibling();
    },
    _MenuWidgetFactoryBase_firstChildItem = function _MenuWidgetFactoryBase_firstChildItem(item) {
        const menu = menuItemWidget.getMenu(item);
        if (menu) {
            const walker = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_walker, "f");
            walker.currentNode = menu;
            return walker.firstChild();
        }
        return null;
    },
    _MenuWidgetFactoryBase_getActiveItem = function _MenuWidgetFactoryBase_getActiveItem(menu) {
        return menu.querySelector(":is(:scope, :scope > .menuitemgroup) > .menuitem:focus-within");
    },
    _MenuWidgetFactoryBase_setItemTimeout = async function _MenuWidgetFactoryBase_setItemTimeout(item, delay) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(undefined);
            }, delay ?? 0);
            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_toggleTimeouts, "f").set(item, {
                clear: () => {
                    clearTimeout(timeout);
                    reject();
                }
            });
        }).then(() => {
            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_toggleTimeouts, "f").delete(item);
        });
    },
    _MenuWidgetFactoryBase_clearItemTimeout = function _MenuWidgetFactoryBase_clearItemTimeout(item) {
        const timeout = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_toggleTimeouts, "f").get(item);
        if (typeof timeout !== "undefined") {
            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_toggleTimeouts, "f").delete(item);
            timeout.clear();
        }
    },
    _MenuWidgetFactoryBase_handleClickEvent = function _MenuWidgetFactoryBase_handleClickEvent(event) {
        const { target, currentTarget } = event;
        const targetMenu = currentTarget;
        const targetItem = target.closest(".menuitem");
        if (targetItem) {
            const contextual = this.getContextual(targetMenu);
            if (contextual) {
                try {
                    targetMenu.remove();
                }
                catch (error) { }
                ;
            }
            else {
                const isClosestMenu = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_isClosestMenu).call(this, targetMenu, targetItem);
                if (isClosestMenu) {
                    const type = menuItemWidget.getType(targetItem);
                    const name = menuItemWidget.getName(targetItem);
                    const value = menuItemWidget.getValue(targetItem);
                    if (type == "radio") {
                        targetMenu.querySelectorAll(`:is(:scope, :scope > .menuitemgroup) > .menuitem-radio[name=${name}]`)
                            .forEach((radio_i) => {
                            menuItemWidget.setChecked(radio_i, menuItemWidget.getValue(radio_i) == value);
                        });
                    }
                }
            }
            event.stopPropagation();
        }
    },
    _MenuWidgetFactoryBase_handleFocusOutEvent = function _MenuWidgetFactoryBase_handleFocusOutEvent(event) {
        const { target, currentTarget, relatedTarget } = event;
        const targetMenu = currentTarget;
        const lostFocusWithin = !targetMenu.contains(relatedTarget);
        if (lostFocusWithin) {
            const contextual = this.getContextual(targetMenu);
            if (contextual) {
                try {
                    targetMenu.remove();
                }
                catch (error) {
                    undefined;
                }
            }
            else {
                const nearestItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_nearestItem).call(this, targetMenu, target);
                if (nearestItem) {
                    menuItemWidget.collapse(nearestItem);
                }
            }
        }
    },
    _MenuWidgetFactoryBase_handleKeyDownEvent = function _MenuWidgetFactoryBase_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetMenu = currentTarget;
        const activeItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_getActiveItem).call(this, targetMenu);
        switch (key) {
            case "ArrowUp": {
                const previousItem = activeItem ?
                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_previousItem).call(this, activeItem) ?? __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_lastItem).call(this, targetMenu) :
                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_firstItem).call(this, targetMenu);
                previousItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                const nextItem = activeItem ?
                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_nextItem).call(this, activeItem) ?? __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_firstItem).call(this, targetMenu) :
                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_firstItem).call(this, targetMenu);
                nextItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_firstItem).call(this, targetMenu);
                firstItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_lastItem).call(this, targetMenu);
                lastItem?.focus({ preventScroll: true });
                event.stopPropagation();
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    const type = menuItemWidget.getType(activeItem);
                    switch (type) {
                        case "submenu": {
                            menuItemWidget.expand(activeItem);
                            const firstChildItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_firstChildItem).call(this, activeItem);
                            firstChildItem?.focus({ preventScroll: true });
                            event.preventDefault();
                            break;
                        }
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const isTargetClosestMenu = event.composedPath().find(target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")) == targetMenu;
                    if (!isTargetClosestMenu) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({ preventScroll: true });
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const isTargetClosestMenu = event.composedPath().find(target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")) == targetMenu;
                    if (!isTargetClosestMenu) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({ preventScroll: true });
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const type = menuItemWidget.getType(activeItem);
                    switch (type) {
                        case "submenu": {
                            const expanded = menuItemWidget.getExpanded(activeItem);
                            if (!expanded) {
                                menuItemWidget.expand(activeItem);
                                const firstChildItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_firstChildItem).call(this, activeItem);
                                firstChildItem?.focus({ preventScroll: true });
                                event.stopPropagation();
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
    },
    _MenuWidgetFactoryBase_handleMouseOutEvent = function _MenuWidgetFactoryBase_handleMouseOutEvent(event) {
        const { target, currentTarget, relatedTarget } = event;
        const targetMenu = currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_nearestItem).call(this, targetMenu, target);
            if (nearestItem !== null) {
                if (menuItemWidget.getType(nearestItem) == "submenu" &&
                    !menuItemWidget.getExpanded(nearestItem)) {
                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_clearItemTimeout).call(this, nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")) == targetMenu;
                if (isTargetClosestMenu) {
                    const activeItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_getActiveItem).call(this, targetMenu);
                    if (activeItem !== null &&
                        menuItemWidget.getType(activeItem) == "submenu" &&
                        menuItemWidget.getExpanded(activeItem)) {
                        __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_clearItemTimeout).call(this, activeItem);
                        __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_setItemTimeout).call(this, activeItem, mouseOutCollapseDelay)
                            .then(() => {
                            menuItemWidget.collapse(activeItem);
                        })
                            .catch(() => undefined);
                    }
                    const { clientX, clientY } = event;
                    const { left, right, top, bottom } = targetMenu.getBoundingClientRect();
                    const intersectsWithMouse = !(left > clientX || right < clientX || top > clientY || bottom < clientY);
                    const containsRelatedTarget = targetMenu.contains(relatedTarget);
                    if (intersectsWithMouse && containsRelatedTarget) {
                        if (relatedTarget instanceof HTMLElement && relatedTarget.classList.contains("menu") && relatedTarget !== targetMenu) {
                            relatedTarget.focus({ preventScroll: true });
                        }
                        else {
                            targetMenu.focus({ preventScroll: true });
                        }
                    }
                    if (!intersectsWithMouse) {
                        targetMenu.focus({ preventScroll: true });
                    }
                }
            }
        }
    },
    _MenuWidgetFactoryBase_handleMouseOverEvent = function _MenuWidgetFactoryBase_handleMouseOverEvent(event) {
        const { target, currentTarget } = event;
        const targetMenu = currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_nearestItem).call(this, targetMenu, target);
            if (nearestItem !== null) {
                if (menuItemWidget.getType(nearestItem) == "submenu" &&
                    menuItemWidget.getExpanded(nearestItem)) {
                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_clearItemTimeout).call(this, nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")) == targetMenu;
                if (isTargetClosestMenu) {
                    const activeItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_getActiveItem).call(this, targetMenu);
                    if (activeItem !== null) {
                        if (menuItemWidget.getType(activeItem) == "submenu" &&
                            menuItemWidget.getExpanded(activeItem) &&
                            !activeItem.contains(target)) {
                            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_clearItemTimeout).call(this, activeItem);
                            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_setItemTimeout).call(this, activeItem, mouseOutCollapseDelay)
                                .then(() => {
                                menuItemWidget.collapse(activeItem);
                            })
                                .catch(() => undefined);
                        }
                    }
                    nearestItem.focus({ preventScroll: true });
                    if (menuItemWidget.getType(nearestItem) == "submenu") {
                        if (!menuItemWidget.getExpanded(nearestItem)) {
                            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_clearItemTimeout).call(this, nearestItem);
                            __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_setItemTimeout).call(this, nearestItem, mouseOverExpandDelay)
                                .then(() => {
                                const activeItem = __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_getActiveItem).call(this, targetMenu);
                                __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_collapseSubmenus).call(this, targetMenu);
                                if (activeItem) {
                                    __classPrivateFieldGet(this, _MenuWidgetFactoryBase_instances, "m", _MenuWidgetFactoryBase_clearItemTimeout).call(this, activeItem);
                                    menuItemWidget.expand(activeItem);
                                    menuItemWidget.getMenu(activeItem)?.focus({ preventScroll: true });
                                }
                            })
                                .catch(() => undefined);
                        }
                        else {
                            menuItemWidget.getMenu(nearestItem)?.focus({ preventScroll: true });
                        }
                    }
                }
            }
        }
    },
    _a)));
//# sourceMappingURL=MenuWidget.js.map