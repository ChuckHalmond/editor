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
var _ToolBarWidgetFactoryBase_instances, _ToolBarWidgetFactoryBase_template, _ToolBarWidgetFactoryBase_walker, _ToolBarWidgetFactoryBase_getActiveItem, _ToolBarWidgetFactoryBase_walkerNodeFilter, _ToolBarWidgetFactoryBase_firstItem, _ToolBarWidgetFactoryBase_lastItem, _ToolBarWidgetFactoryBase_previousItem, _ToolBarWidgetFactoryBase_nextItem, _ToolBarWidgetFactoryBase_firstChildItem, _ToolBarWidgetFactoryBase_setActiveItem, _ToolBarWidgetFactoryBase_handleClickEvent, _ToolBarWidgetFactoryBase_handleFocusEvent, _ToolBarWidgetFactoryBase_handleFocusInEvent, _ToolBarWidgetFactoryBase_handleFocusOutEvent, _ToolBarWidgetFactoryBase_handleKeyDownEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { toolbarItemWidget } from "./ToolBarItemWidget";
export { toolbarWidget };
var toolbarWidget = new (Widget({
    name: "toolbar"
})((_a = class ToolBarWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _ToolBarWidgetFactoryBase_instances.add(this);
            _ToolBarWidgetFactoryBase_template.set(this, void 0);
            _ToolBarWidgetFactoryBase_walker.set(this, void 0);
            __classPrivateFieldSet(this, _ToolBarWidgetFactoryBase_template, element("div", {
                attributes: {
                    class: "toolbar",
                    role: "toolbar",
                    tabindex: -1
                }
            }), "f");
            __classPrivateFieldSet(this, _ToolBarWidgetFactoryBase_walker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_walkerNodeFilter).bind(this)), "f");
        }
        create(properties) {
            const toolbar = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_template, "f").cloneNode(true);
            toolbar.addEventListener("focus", __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_handleFocusEvent).bind(this));
            toolbar.addEventListener("focusin", __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_handleFocusInEvent).bind(this));
            toolbar.addEventListener("focusout", __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_handleFocusOutEvent).bind(this));
            toolbar.addEventListener("keydown", __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_handleKeyDownEvent).bind(this));
            toolbar.addEventListener("click", __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_handleClickEvent).bind(this));
            if (properties !== undefined) {
                const { id, classList, tabIndex } = properties;
                if (id !== undefined) {
                    toolbar.id = id;
                }
                if (classList !== undefined) {
                    toolbar.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    toolbar.tabIndex = tabIndex;
                }
            }
            return toolbar;
        }
        slot(toolbar) {
            return toolbar;
        }
        items(toolbar) {
            return Array.from(toolbar.querySelectorAll(":is(:scope, :scope > .toolbaritemgroup) > .toolbaritem"));
        }
        setOrientation(toolbar, value) {
            toolbar.setAttribute("aria-orientation", value);
        }
        getOrientation(toolbar) {
            return toolbar.getAttribute("aria-orientation") ?? "horizontal";
        }
    },
    _ToolBarWidgetFactoryBase_template = new WeakMap(),
    _ToolBarWidgetFactoryBase_walker = new WeakMap(),
    _ToolBarWidgetFactoryBase_instances = new WeakSet(),
    _ToolBarWidgetFactoryBase_getActiveItem = function _ToolBarWidgetFactoryBase_getActiveItem(toolbar) {
        return toolbar.querySelector(":is(:scope, :scope > .toolbaritemgroup) > .toolbaritem.active");
    },
    _ToolBarWidgetFactoryBase_walkerNodeFilter = function _ToolBarWidgetFactoryBase_walkerNodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("toolbaritem") && !toolbarItemWidget.getDisabled(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("toolbaritemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _ToolBarWidgetFactoryBase_firstItem = function _ToolBarWidgetFactoryBase_firstItem(toolbar) {
        const walker = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_walker, "f");
        walker.currentNode = toolbar;
        return walker.firstChild();
    },
    _ToolBarWidgetFactoryBase_lastItem = function _ToolBarWidgetFactoryBase_lastItem(toolbar) {
        const walker = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_walker, "f");
        walker.currentNode = toolbar;
        return walker.lastChild();
    },
    _ToolBarWidgetFactoryBase_previousItem = function _ToolBarWidgetFactoryBase_previousItem(item) {
        const walker = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        const previousItem = walker.previousSibling();
        return previousItem;
    },
    _ToolBarWidgetFactoryBase_nextItem = function _ToolBarWidgetFactoryBase_nextItem(item) {
        const walker = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        return walker.nextSibling();
    },
    _ToolBarWidgetFactoryBase_firstChildItem = function _ToolBarWidgetFactoryBase_firstChildItem(item) {
        const menu = toolbarItemWidget.menu(item);
        if (menu) {
            const walker = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_walker, "f");
            walker.currentNode = menu;
            return walker.firstChild();
        }
        return null;
    },
    _ToolBarWidgetFactoryBase_setActiveItem = function _ToolBarWidgetFactoryBase_setActiveItem(tree, item) {
        const activeItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_getActiveItem).call(this, tree);
        if (activeItem !== null && activeItem !== item) {
            toolbarItemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            toolbarItemWidget.setActive(item, true);
            item.tabIndex = 0;
        }
    },
    _ToolBarWidgetFactoryBase_handleClickEvent = function _ToolBarWidgetFactoryBase_handleClickEvent(event) {
        const { currentTarget, target } = event;
        const toolbar = currentTarget;
        const targetItem = target.closest(".toolbaritem");
        if (targetItem) {
            const type = toolbarItemWidget.getType(targetItem);
            const name = toolbarItemWidget.getName(targetItem);
            const value = toolbarItemWidget.getType(targetItem);
            if (type == "radio") {
                toolbar.querySelectorAll(`:is(:scope, :scope > .toolbaritemgroup) > .toolbaritem[type=radio][name=${name}]`).forEach((radio_i) => {
                    toolbarItemWidget.setPressed(radio_i, toolbarItemWidget.getValue(radio_i) == value);
                });
            }
            event.stopPropagation();
        }
    },
    _ToolBarWidgetFactoryBase_handleFocusEvent = function _ToolBarWidgetFactoryBase_handleFocusEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetToolbar = currentTarget;
        const focusWithin = targetToolbar.contains(relatedTarget);
        if (!focusWithin) {
            const activeItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_getActiveItem).call(this, targetToolbar);
            if (activeItem) {
                activeItem.focus();
            }
            else {
                const firstItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_firstItem).call(this, targetToolbar);
                firstItem?.focus();
            }
        }
    },
    _ToolBarWidgetFactoryBase_handleFocusInEvent = function _ToolBarWidgetFactoryBase_handleFocusInEvent(event) {
        const { currentTarget, target } = event;
        const targetToolbar = currentTarget;
        const targetItem = target.closest(".toolbaritem");
        if (targetItem) {
            __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_setActiveItem).call(this, targetToolbar, targetItem);
            targetToolbar.tabIndex = -1;
        }
    },
    _ToolBarWidgetFactoryBase_handleFocusOutEvent = function _ToolBarWidgetFactoryBase_handleFocusOutEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetToolbar = currentTarget;
        const lostFocusWithin = !targetToolbar.contains(relatedTarget);
        if (lostFocusWithin) {
            __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_setActiveItem).call(this, targetToolbar, null);
            targetToolbar.tabIndex = 0;
        }
    },
    _ToolBarWidgetFactoryBase_handleKeyDownEvent = function _ToolBarWidgetFactoryBase_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetToolbar = currentTarget;
        const activeItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_getActiveItem).call(this, targetToolbar);
        switch (key) {
            case "Enter":
            case " ": {
                if (activeItem) {
                    const type = toolbarItemWidget.getType(activeItem);
                    switch (type) {
                        case "menubutton": {
                            toolbarItemWidget.expand(activeItem);
                            const firstChildItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_firstChildItem).call(this, activeItem);
                            firstChildItem?.focus({ preventScroll: true });
                            event.preventDefault();
                            break;
                        }
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const previousItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_previousItem).call(this, activeItem);
                    if (previousItem) {
                        previousItem.focus({ preventScroll: true });
                    }
                }
                else {
                    const firstItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_firstItem).call(this, targetToolbar);
                    if (firstItem) {
                        firstItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const nextItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_nextItem).call(this, activeItem);
                    if (nextItem) {
                        nextItem.focus({ preventScroll: true });
                    }
                }
                else {
                    const lastItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_lastItem).call(this, targetToolbar);
                    if (lastItem) {
                        lastItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_firstItem).call(this, targetToolbar);
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = __classPrivateFieldGet(this, _ToolBarWidgetFactoryBase_instances, "m", _ToolBarWidgetFactoryBase_lastItem).call(this, targetToolbar);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (activeItem) {
                    activeItem.focus({ preventScroll: true });
                }
                else {
                    targetToolbar.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
        }
    },
    _a)));
//# sourceMappingURL=ToolBarWidget.js.map