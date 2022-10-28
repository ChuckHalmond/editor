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
var _MenubarWidgetFactoryBase_instances, _MenubarWidgetFactoryBase_template, _MenubarWidgetFactoryBase_walker, _MenubarWidgetFactoryBase_walkerNodeFilter, _MenubarWidgetFactoryBase_getActiveItem, _MenubarWidgetFactoryBase_firstItem, _MenubarWidgetFactoryBase_lastItem, _MenubarWidgetFactoryBase_previousItem, _MenubarWidgetFactoryBase_nextItem, _MenubarWidgetFactoryBase_firstChildItem, _MenubarWidgetFactoryBase_isClosestMenu, _MenubarWidgetFactoryBase_nearestItem, _MenubarWidgetFactoryBase_handleClickEvent, _MenubarWidgetFactoryBase_handleFocusInEvent, _MenubarWidgetFactoryBase_handleFocusOutEvent, _MenubarWidgetFactoryBase_handleMouseOverEvent, _MenubarWidgetFactoryBase_handleKeyDownEvent, _a;
import { element } from "../../../elements/Element";
import { menuItemWidget } from "./MenuItemWidget";
import { Widget, WidgetFactory } from "../Widget";
export { menuBarWidget };
var menuBarWidget = new (Widget({
    name: "menubar"
})((_a = class MenubarWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _MenubarWidgetFactoryBase_instances.add(this);
            _MenubarWidgetFactoryBase_template.set(this, void 0);
            _MenubarWidgetFactoryBase_walker.set(this, void 0);
            __classPrivateFieldSet(this, _MenubarWidgetFactoryBase_template, element("div", {
                attributes: {
                    class: "menubar",
                    role: "menubar",
                    tabindex: 0
                }
            }), "f");
            __classPrivateFieldSet(this, _MenubarWidgetFactoryBase_walker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_walkerNodeFilter).bind(this)), "f");
        }
        create() {
            const menubar = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_template, "f").cloneNode(true);
            menubar.addEventListener("click", __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_handleClickEvent).bind(this));
            menubar.addEventListener("focusin", __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_handleFocusInEvent).bind(this));
            menubar.addEventListener("focusout", __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_handleFocusOutEvent).bind(this));
            menubar.addEventListener("mouseover", __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_handleMouseOverEvent).bind(this));
            menubar.addEventListener("keydown", __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_handleKeyDownEvent).bind(this));
            return menubar;
        }
        slot(menubar) {
            return menubar;
        }
        setExpanded(menubar, value) {
            menubar.toggleAttribute("aria-expanded", value);
        }
        getExpanded(menubar) {
            return menubar.hasAttribute("aria-expanded");
        }
    },
    _MenubarWidgetFactoryBase_template = new WeakMap(),
    _MenubarWidgetFactoryBase_walker = new WeakMap(),
    _MenubarWidgetFactoryBase_instances = new WeakSet(),
    _MenubarWidgetFactoryBase_walkerNodeFilter = function _MenubarWidgetFactoryBase_walkerNodeFilter(node) {
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
    _MenubarWidgetFactoryBase_getActiveItem = function _MenubarWidgetFactoryBase_getActiveItem(menubar) {
        return menubar.querySelector(":is(:scope, :scope > .menuitemgroup) > .menuitem:focus-within");
    },
    _MenubarWidgetFactoryBase_firstItem = function _MenubarWidgetFactoryBase_firstItem(menubar) {
        const walker = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_walker, "f");
        walker.currentNode = menubar;
        return walker.firstChild();
    },
    _MenubarWidgetFactoryBase_lastItem = function _MenubarWidgetFactoryBase_lastItem(menubar) {
        const walker = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_walker, "f");
        walker.currentNode = menubar;
        return walker.lastChild();
    },
    _MenubarWidgetFactoryBase_previousItem = function _MenubarWidgetFactoryBase_previousItem(item) {
        const walker = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        return walker.previousSibling();
    },
    _MenubarWidgetFactoryBase_nextItem = function _MenubarWidgetFactoryBase_nextItem(item) {
        const walker = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        return walker.nextSibling();
    },
    _MenubarWidgetFactoryBase_firstChildItem = function _MenubarWidgetFactoryBase_firstChildItem(item) {
        const menu = menuItemWidget.getMenu(item);
        if (menu) {
            const walker = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_walker, "f");
            walker.currentNode = menu;
            return walker.firstChild();
        }
        return null;
    },
    _MenubarWidgetFactoryBase_isClosestMenu = function _MenubarWidgetFactoryBase_isClosestMenu(menubar, target) {
        return target.closest(":is(.menubar, .menu)") == menubar;
    },
    _MenubarWidgetFactoryBase_nearestItem = function _MenubarWidgetFactoryBase_nearestItem(menubar, target) {
        return Array.from(menubar.querySelectorAll(":is(:scope, :scope > .menuitemgroup) > .menuitem")).find(item_i => item_i.contains(target)) ?? null;
    },
    _MenubarWidgetFactoryBase_handleClickEvent = function _MenubarWidgetFactoryBase_handleClickEvent(event) {
        const { target, currentTarget } = event;
        const menubar = currentTarget;
        const targetItem = target.closest(".menuitem");
        if (targetItem) {
            const expanded = this.getExpanded(menubar);
            const isClosestMenu = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_isClosestMenu).call(this, menubar, targetItem);
            if (isClosestMenu) {
                const isExpanded = !expanded;
                this.setExpanded(menubar, isExpanded);
                if (isExpanded) {
                    if (targetItem !== null && !menuItemWidget.getExpanded(targetItem)) {
                        menuItemWidget.expand(targetItem);
                    }
                    const menu = menuItemWidget.getMenu(targetItem);
                    menu?.focus({ preventScroll: true });
                }
                else {
                    menubar.focus({ preventScroll: true });
                }
            }
        }
    },
    _MenubarWidgetFactoryBase_handleFocusInEvent = function _MenubarWidgetFactoryBase_handleFocusInEvent(event) {
        const { target, currentTarget } = event;
        const menubar = currentTarget;
        if (target instanceof HTMLElement && this.getExpanded(menubar)) {
            const nearestItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_nearestItem).call(this, menubar, target);
            if (nearestItem) {
                menuItemWidget.expand(nearestItem);
            }
        }
    },
    _MenubarWidgetFactoryBase_handleFocusOutEvent = function _MenubarWidgetFactoryBase_handleFocusOutEvent(event) {
        const { target, currentTarget, relatedTarget } = event;
        const menubar = currentTarget;
        if (target instanceof HTMLElement && !target.contains(relatedTarget)) {
            const nearestItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_nearestItem).call(this, menubar, target);
            if (nearestItem) {
                menuItemWidget.collapse(nearestItem);
            }
        }
        const lostFocusWithin = !menubar.contains(relatedTarget);
        if (lostFocusWithin) {
            this.setExpanded(menubar, false);
        }
    },
    _MenubarWidgetFactoryBase_handleMouseOverEvent = function _MenubarWidgetFactoryBase_handleMouseOverEvent(event) {
        const { target, currentTarget } = event;
        const menubar = currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const activeItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_getActiveItem).call(this, menubar);
            const expanded = this.getExpanded(menubar);
            const isClosestMenu = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_isClosestMenu).call(this, menubar, target);
            if (isClosestMenu && target !== activeItem && expanded) {
                const menu = menuItemWidget.getMenu(target);
                if (menu) {
                    menu.focus({ preventScroll: true });
                }
                else {
                    target.focus({ preventScroll: true });
                }
            }
        }
    },
    _MenubarWidgetFactoryBase_handleKeyDownEvent = function _MenubarWidgetFactoryBase_handleKeyDownEvent(event) {
        const { key, currentTarget } = event;
        const menubar = currentTarget;
        let activeItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_getActiveItem).call(this, menubar);
        const expanded = this.getExpanded(menubar);
        switch (key) {
            case "ArrowLeft": {
                const previousItem = activeItem ?
                    __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_previousItem).call(this, activeItem) ?? __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_lastItem).call(this, menubar) :
                    __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_firstItem).call(this, menubar);
                previousItem?.focus({ preventScroll: true });
                activeItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_getActiveItem).call(this, menubar);
                if (expanded && activeItem) {
                    const firstChildItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_firstChildItem).call(this, activeItem);
                    firstChildItem?.focus({ preventScroll: true });
                }
                break;
            }
            case "ArrowRight": {
                const nextItem = activeItem ?
                    __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_nextItem).call(this, activeItem) ?? __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_firstItem).call(this, menubar) :
                    __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_lastItem).call(this, menubar);
                nextItem?.focus({ preventScroll: true });
                activeItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_getActiveItem).call(this, menubar);
                if (expanded && activeItem) {
                    const firstChildItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_firstChildItem).call(this, activeItem);
                    firstChildItem?.focus({ preventScroll: true });
                }
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    this.setExpanded(menubar, !expanded);
                    const firstChildItem = __classPrivateFieldGet(this, _MenubarWidgetFactoryBase_instances, "m", _MenubarWidgetFactoryBase_firstChildItem).call(this, activeItem);
                    firstChildItem?.focus({ preventScroll: true });
                    event.preventDefault();
                }
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.setExpanded(menubar, false);
                    if (activeItem) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({ preventScroll: true });
                    }
                }
                else {
                    menubar.focus({ preventScroll: true });
                }
                break;
            }
        }
    },
    _a)));
//# sourceMappingURL=MenuBarWidget.js.map