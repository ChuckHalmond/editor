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
var _ListWidgetFactoryBase_instances, _ListWidgetFactoryBase_template, _ListWidgetFactoryBase_walker, _ListWidgetFactoryBase_onSelection, _ListWidgetFactoryBase_hasSelectionChanged, _ListWidgetFactoryBase_getActiveItem, _ListWidgetFactoryBase_getDropTargetItem, _ListWidgetFactoryBase_nodeFilter, _ListWidgetFactoryBase_getItemsRange, _ListWidgetFactoryBase_setSelection, _ListWidgetFactoryBase_addToSelection, _ListWidgetFactoryBase_removeFromSelection, _ListWidgetFactoryBase_clearSelection, _ListWidgetFactoryBase_setActiveItem, _ListWidgetFactoryBase_setDropTargetItem, _ListWidgetFactoryBase_firstItem, _ListWidgetFactoryBase_lastItem, _ListWidgetFactoryBase_previousItem, _ListWidgetFactoryBase_nextItem, _ListWidgetFactoryBase_handleDragEndEvent, _ListWidgetFactoryBase_handleDragEnterEvent, _ListWidgetFactoryBase_handleDragOverEvent, _ListWidgetFactoryBase_handleDragLeaveEvent, _ListWidgetFactoryBase_handleDragStartEvent, _ListWidgetFactoryBase_handleDropEvent, _ListWidgetFactoryBase_handleFocusEvent, _ListWidgetFactoryBase_handleFocusInEvent, _ListWidgetFactoryBase_handleKeyDownEvent, _ListWidgetFactoryBase_handleMouseDownEvent, _ListWidgetFactoryBase_handleFocusOutEvent, _ListWidgetFactoryBase_handleSelectEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { listItemWidget } from "./ListItemWidget";
export { listWidget };
var listWidget = new (Widget({
    name: "list"
})((_a = class ListWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _ListWidgetFactoryBase_instances.add(this);
            _ListWidgetFactoryBase_template.set(this, void 0);
            _ListWidgetFactoryBase_walker.set(this, void 0);
            _ListWidgetFactoryBase_onSelection.set(this, void 0);
            _ListWidgetFactoryBase_hasSelectionChanged.set(this, void 0);
            __classPrivateFieldSet(this, _ListWidgetFactoryBase_template, element("ul", {
                attributes: {
                    class: "list",
                    role: "list",
                    tabindex: 0
                }
            }), "f");
            __classPrivateFieldSet(this, _ListWidgetFactoryBase_onSelection, new WeakMap(), "f");
            __classPrivateFieldSet(this, _ListWidgetFactoryBase_hasSelectionChanged, new WeakMap(), "f");
            __classPrivateFieldSet(this, _ListWidgetFactoryBase_walker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_nodeFilter).bind(this)), "f");
        }
        create(properties) {
            const list = __classPrivateFieldGet(this, _ListWidgetFactoryBase_template, "f").cloneNode(true);
            list.addEventListener("dragend", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleDragEndEvent).bind(this));
            list.addEventListener("dragenter", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleDragEnterEvent).bind(this));
            list.addEventListener("dragleave", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleDragLeaveEvent).bind(this));
            list.addEventListener("dragover", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleDragOverEvent).bind(this));
            list.addEventListener("dragstart", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleDragStartEvent).bind(this));
            list.addEventListener("drop", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleDropEvent).bind(this));
            list.addEventListener("focus", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleFocusEvent).bind(this));
            list.addEventListener("focusin", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleFocusInEvent).bind(this));
            list.addEventListener("focusout", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleFocusOutEvent).bind(this));
            list.addEventListener("keydown", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleKeyDownEvent).bind(this));
            list.addEventListener("mousedown", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleMouseDownEvent).bind(this));
            list.addEventListener("select", __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_handleSelectEvent).bind(this));
            if (properties !== undefined) {
                const { id, classList, tabIndex, multisectable } = properties;
                if (id !== undefined) {
                    list.id = id;
                }
                if (classList !== undefined) {
                    list.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    list.tabIndex = tabIndex;
                }
                if (multisectable !== undefined) {
                    this.setMultiSelectable(list, multisectable);
                }
            }
            __classPrivateFieldGet(this, _ListWidgetFactoryBase_onSelection, "f").set(list, false);
            __classPrivateFieldGet(this, _ListWidgetFactoryBase_hasSelectionChanged, "f").set(list, false);
            return list;
        }
        slot(list) {
            return list;
        }
        slottedCallback(list, slot) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((child_i, i) => {
                if (child_i instanceof HTMLElement && child_i.classList.contains("listitem")) {
                    listItemWidget.setPosInSet(child_i, i);
                }
            });
        }
        setMultiSelectable(tree, value) {
            tree.setAttribute("aria-multiselectable", String(value));
        }
        getMultiSelectable(tree) {
            return JSON.parse(tree.getAttribute("aria-multiselectable") ?? String(false));
        }
        items(list) {
            return Array.from(list.querySelectorAll(":is(:scope, :scope > .listitemgroup) > .listitem"));
        }
        selectedItems(list) {
            const selectedItems = [];
            const walker = __classPrivateFieldGet(this, _ListWidgetFactoryBase_walker, "f");
            walker.currentNode = list;
            let item = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_firstItem).call(this, list);
            while (item !== null) {
                const selected = listItemWidget.getSelected(item);
                if (selected) {
                    selectedItems.push(item);
                }
                item = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_nextItem).call(this, item);
            }
            return selectedItems;
        }
        beginSelection(list) {
            __classPrivateFieldGet(this, _ListWidgetFactoryBase_onSelection, "f").set(list, true);
        }
        endSelection(list) {
            __classPrivateFieldGet(this, _ListWidgetFactoryBase_onSelection, "f").set(list, false);
            if (__classPrivateFieldGet(this, _ListWidgetFactoryBase_hasSelectionChanged, "f").get(list)) {
                list.dispatchEvent(new Event("selectionchange", { bubbles: true }));
                __classPrivateFieldGet(this, _ListWidgetFactoryBase_hasSelectionChanged, "f").set(list, false);
            }
        }
    },
    _ListWidgetFactoryBase_template = new WeakMap(),
    _ListWidgetFactoryBase_walker = new WeakMap(),
    _ListWidgetFactoryBase_onSelection = new WeakMap(),
    _ListWidgetFactoryBase_hasSelectionChanged = new WeakMap(),
    _ListWidgetFactoryBase_instances = new WeakSet(),
    _ListWidgetFactoryBase_getActiveItem = function _ListWidgetFactoryBase_getActiveItem(tree) {
        return tree.querySelector(".listitem.active");
    },
    _ListWidgetFactoryBase_getDropTargetItem = function _ListWidgetFactoryBase_getDropTargetItem(tree) {
        return tree.querySelector(".listitem.droptarget");
    },
    _ListWidgetFactoryBase_nodeFilter = function _ListWidgetFactoryBase_nodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("listitem") && !listItemWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("listitemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _ListWidgetFactoryBase_getItemsRange = function _ListWidgetFactoryBase_getItemsRange(from, to) {
        if (from == to) {
            return [from];
        }
        const position = from.compareDocumentPosition(to);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            const range = [from];
            let nextItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_nextItem).call(this, from);
            while (nextItem && nextItem !== to) {
                range.push(nextItem);
                nextItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_nextItem).call(this, nextItem);
            }
            range.push(to);
            return range;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            const range = [from];
            let previousItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_previousItem).call(this, from);
            while (previousItem && previousItem !== to) {
                range.push(previousItem);
                previousItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_previousItem).call(this, previousItem);
            }
            range.push(to);
            return range;
        }
        return [];
    },
    _ListWidgetFactoryBase_setSelection = function _ListWidgetFactoryBase_setSelection(list, ...items) {
        const selectedItems = this.selectedItems(list);
        this.beginSelection(list);
        selectedItems.forEach((item_i) => {
            if (!items.includes(item_i)) {
                listItemWidget.setSelected(item_i, false);
            }
        });
        items.forEach((item_i) => {
            const selected = listItemWidget.getSelected(item_i);
            if (list.contains(item_i) && !selected) {
                listItemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(list);
    },
    _ListWidgetFactoryBase_addToSelection = function _ListWidgetFactoryBase_addToSelection(list, ...items) {
        this.beginSelection(list);
        items.forEach((item_i) => {
            if (!listItemWidget.getSelected(item_i)) {
                listItemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(list);
    },
    _ListWidgetFactoryBase_removeFromSelection = function _ListWidgetFactoryBase_removeFromSelection(list, ...items) {
        const selectedItems = this.selectedItems(list);
        this.beginSelection(list);
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                listItemWidget.setSelected(item_i, false);
            }
        });
        this.endSelection(list);
    },
    _ListWidgetFactoryBase_clearSelection = function _ListWidgetFactoryBase_clearSelection(list) {
        const selectedItems = this.selectedItems(list);
        this.beginSelection(list);
        selectedItems.forEach((item_i) => {
            listItemWidget.setSelected(item_i, false);
        });
        this.endSelection(list);
    },
    _ListWidgetFactoryBase_setActiveItem = function _ListWidgetFactoryBase_setActiveItem(list, item) {
        const activeItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getActiveItem).call(this, list);
        if (activeItem !== null && activeItem !== item) {
            listItemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            listItemWidget.setActive(item, true);
            item.tabIndex = 0;
        }
    },
    _ListWidgetFactoryBase_setDropTargetItem = function _ListWidgetFactoryBase_setDropTargetItem(list, item) {
        const { classList } = list;
        const dropTargetItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getDropTargetItem).call(this, list);
        if (dropTargetItem !== null && dropTargetItem !== item) {
            listItemWidget.setDropTarget(dropTargetItem, false);
        }
        if (item !== null) {
            listItemWidget.setDropTarget(item, false);
            classList.add("droptarget");
        }
        else {
            classList.remove("droptarget");
        }
    },
    _ListWidgetFactoryBase_firstItem = function _ListWidgetFactoryBase_firstItem(list) {
        const walker = __classPrivateFieldGet(this, _ListWidgetFactoryBase_walker, "f");
        walker.currentNode = list;
        return walker.firstChild();
    },
    _ListWidgetFactoryBase_lastItem = function _ListWidgetFactoryBase_lastItem(list) {
        const walker = __classPrivateFieldGet(this, _ListWidgetFactoryBase_walker, "f");
        walker.currentNode = list;
        return walker.lastChild();
    },
    _ListWidgetFactoryBase_previousItem = function _ListWidgetFactoryBase_previousItem(item) {
        const walker = __classPrivateFieldGet(this, _ListWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        const previousItem = walker.previousNode();
        return previousItem;
    },
    _ListWidgetFactoryBase_nextItem = function _ListWidgetFactoryBase_nextItem(item) {
        const walker = __classPrivateFieldGet(this, _ListWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        const nextItem = walker.nextNode();
        return nextItem;
    },
    _ListWidgetFactoryBase_handleDragEndEvent = function _ListWidgetFactoryBase_handleDragEndEvent(event) {
        const { currentTarget } = event;
        const targetList = currentTarget;
        __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setDropTargetItem).call(this, targetList, null);
    },
    _ListWidgetFactoryBase_handleDragEnterEvent = function _ListWidgetFactoryBase_handleDragEnterEvent(event) {
        const { currentTarget, target } = event;
        const targetItem = target.closest(".listitem");
        const targetList = currentTarget;
        if (targetItem) {
            __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setDropTargetItem).call(this, targetList, targetItem);
        }
        event.preventDefault();
    },
    _ListWidgetFactoryBase_handleDragOverEvent = function _ListWidgetFactoryBase_handleDragOverEvent(event) {
        event.preventDefault();
    },
    _ListWidgetFactoryBase_handleDragLeaveEvent = function _ListWidgetFactoryBase_handleDragLeaveEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetList = currentTarget;
        if (relatedTarget) {
            const relatedTargetRoot = relatedTarget.getRootNode();
            const relatedTargetHost = relatedTargetRoot instanceof ShadowRoot ?
                relatedTargetRoot.host :
                relatedTarget;
            if (!targetList.contains(relatedTargetHost)) {
                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setDropTargetItem).call(this, targetList, null);
            }
        }
    },
    _ListWidgetFactoryBase_handleDragStartEvent = function _ListWidgetFactoryBase_handleDragStartEvent(event) {
        const { currentTarget, target } = event;
        const targetTree = currentTarget;
        const targetItem = target.closest(".listitem");
        if (targetItem) {
            const selectedItems = this.selectedItems(targetTree);
            if (!selectedItems.includes(targetItem)) {
                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setSelection).call(this, targetTree, targetItem);
            }
        }
    },
    _ListWidgetFactoryBase_handleDropEvent = function _ListWidgetFactoryBase_handleDropEvent(event) {
        const { currentTarget } = event;
        const targetTree = currentTarget;
        __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setDropTargetItem).call(this, targetTree, null);
    },
    _ListWidgetFactoryBase_handleFocusEvent = function _ListWidgetFactoryBase_handleFocusEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetTree = currentTarget;
        const activeItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getActiveItem).call(this, targetTree);
        if (activeItem && relatedTarget !== activeItem) {
            activeItem.focus();
        }
    },
    _ListWidgetFactoryBase_handleFocusInEvent = function _ListWidgetFactoryBase_handleFocusInEvent(event) {
        const { currentTarget, target } = event;
        const targetTree = currentTarget;
        const targetItem = target.closest(".listitem");
        if (targetItem) {
            __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setActiveItem).call(this, targetTree, targetItem);
            targetTree.tabIndex = -1;
        }
    },
    _ListWidgetFactoryBase_handleKeyDownEvent = function _ListWidgetFactoryBase_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetList = currentTarget;
        const activeItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getActiveItem).call(this, targetList);
        switch (key) {
            case "a": {
                const { ctrlKey } = event;
                if (ctrlKey) {
                    if (activeItem) {
                        const walker = __classPrivateFieldGet(this, _ListWidgetFactoryBase_walker, "f");
                        walker.currentNode = activeItem;
                        const firstItem = (walker.currentNode = walker.parentNode() ?? targetList, walker.firstChild());
                        const lastItem = (walker.currentNode = walker.parentNode() ?? targetList, walker.lastChild());
                        if (firstItem && lastItem) {
                            const range = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getItemsRange).call(this, firstItem, lastItem);
                            if (range) {
                                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setSelection).call(this, targetList, ...range);
                            }
                        }
                    }
                }
                event.preventDefault();
                break;
            }
            case "ArrowUp": {
                if (activeItem) {
                    const previousItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_previousItem).call(this, activeItem);
                    if (previousItem) {
                        previousItem.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            const selected = listItemWidget.getSelected(previousItem);
                            selected ?
                                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_removeFromSelection).call(this, targetList, previousItem) :
                                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_addToSelection).call(this, targetList, previousItem);
                        }
                    }
                }
                else {
                    const firstItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_firstItem).call(this, targetList);
                    if (firstItem) {
                        firstItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (activeItem) {
                    const nextItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_nextItem).call(this, activeItem);
                    if (nextItem) {
                        nextItem.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            const selected = listItemWidget.getSelected(nextItem);
                            selected ?
                                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_removeFromSelection).call(this, targetList, nextItem) :
                                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_addToSelection).call(this, targetList, nextItem);
                        }
                    }
                }
                else {
                    const lastItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_lastItem).call(this, targetList);
                    if (lastItem) {
                        lastItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_firstItem).call(this, targetList);
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_lastItem).call(this, targetList);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setSelection).call(this, targetList, activeItem);
                    activeItem.click();
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_clearSelection).call(this, targetList);
                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setActiveItem).call(this, targetList, null);
                targetList.focus();
                event.stopPropagation();
                break;
            }
        }
    },
    _ListWidgetFactoryBase_handleMouseDownEvent = function _ListWidgetFactoryBase_handleMouseDownEvent(event) {
        const { currentTarget, target, ctrlKey, shiftKey, button } = event;
        const targetList = currentTarget;
        const targetItem = target.closest(".listitem");
        if (targetItem) {
            const selected = listItemWidget.getSelected(targetItem);
            switch (button) {
                case 0: {
                    if (!shiftKey && !ctrlKey) {
                        __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setSelection).call(this, targetList, targetItem);
                    }
                    else if (ctrlKey) {
                        if (selected) {
                            targetItem.blur();
                            __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_removeFromSelection).call(this, targetList, targetItem);
                        }
                        else {
                            __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_addToSelection).call(this, targetList, targetItem);
                        }
                        event.stopPropagation();
                    }
                    else if (shiftKey) {
                        const activeItem = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getActiveItem).call(this, targetList);
                        if (activeItem) {
                            const range = __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_getItemsRange).call(this, activeItem, targetItem);
                            if (range) {
                                __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setSelection).call(this, targetList, ...range);
                            }
                        }
                        event.stopPropagation();
                    }
                    break;
                }
                case 2: {
                    if (!selected) {
                        __classPrivateFieldGet(this, _ListWidgetFactoryBase_instances, "m", _ListWidgetFactoryBase_setSelection).call(this, targetList, targetItem);
                    }
                    break;
                }
            }
        }
    },
    _ListWidgetFactoryBase_handleFocusOutEvent = function _ListWidgetFactoryBase_handleFocusOutEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetList = currentTarget;
        const lostFocusWithin = !targetList.contains(relatedTarget);
        if (lostFocusWithin) {
            targetList.tabIndex = 0;
        }
    },
    _ListWidgetFactoryBase_handleSelectEvent = function _ListWidgetFactoryBase_handleSelectEvent(event) {
        const { currentTarget } = event;
        const targetList = currentTarget;
        if (targetList) {
            if (__classPrivateFieldGet(this, _ListWidgetFactoryBase_onSelection, "f").get(targetList)) {
                __classPrivateFieldGet(this, _ListWidgetFactoryBase_hasSelectionChanged, "f").set(targetList, true);
            }
            else {
                targetList.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            }
        }
    },
    _a)));
//# sourceMappingURL=ListWidget.js.map