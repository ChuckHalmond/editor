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
var _TreeWidgetFactoryBase_instances, _TreeWidgetFactoryBase_template, _TreeWidgetFactoryBase_walker, _TreeWidgetFactoryBase_onSelection, _TreeWidgetFactoryBase_hasSelectionChanged, _TreeWidgetFactoryBase_getActiveItem, _TreeWidgetFactoryBase_getDropTargetItem, _TreeWidgetFactoryBase_setDropTargetItem, _TreeWidgetFactoryBase_nodeFilter, _TreeWidgetFactoryBase_getItemsRange, _TreeWidgetFactoryBase_setSelection, _TreeWidgetFactoryBase_addToSelection, _TreeWidgetFactoryBase_removeFromSelection, _TreeWidgetFactoryBase_clearSelection, _TreeWidgetFactoryBase_setActiveItem, _TreeWidgetFactoryBase_firstItem, _TreeWidgetFactoryBase_lastItem, _TreeWidgetFactoryBase_previousItem, _TreeWidgetFactoryBase_nextItem, _TreeWidgetFactoryBase_deepestItem, _TreeWidgetFactoryBase_handleMouseDownEvent, _TreeWidgetFactoryBase_handleDragEndEvent, _TreeWidgetFactoryBase_handleDragEnterEvent, _TreeWidgetFactoryBase_handleDragOverEvent, _TreeWidgetFactoryBase_handleDragLeaveEvent, _TreeWidgetFactoryBase_handleDropEvent, _TreeWidgetFactoryBase_handleFocusEvent, _TreeWidgetFactoryBase_handleFocusInEvent, _TreeWidgetFactoryBase_handleFocusOutEvent, _TreeWidgetFactoryBase_handleKeyDownEvent, _TreeWidgetFactoryBase_handleSelectEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { treeItemWidget } from "./TreeItemWidget";
export { treeWidget };
var treeWidget = new (Widget({
    name: "tree"
})((_a = class TreeWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _TreeWidgetFactoryBase_instances.add(this);
            _TreeWidgetFactoryBase_template.set(this, void 0);
            _TreeWidgetFactoryBase_walker.set(this, void 0);
            _TreeWidgetFactoryBase_onSelection.set(this, void 0);
            _TreeWidgetFactoryBase_hasSelectionChanged.set(this, void 0);
            __classPrivateFieldSet(this, _TreeWidgetFactoryBase_template, element("ul", {
                attributes: {
                    class: "tree",
                    role: "tree",
                    tabindex: 0
                }
            }), "f");
            __classPrivateFieldSet(this, _TreeWidgetFactoryBase_onSelection, new WeakMap(), "f");
            __classPrivateFieldSet(this, _TreeWidgetFactoryBase_hasSelectionChanged, new WeakMap(), "f");
            __classPrivateFieldSet(this, _TreeWidgetFactoryBase_walker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_nodeFilter).bind(this)), "f");
        }
        create(properties) {
            const tree = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_template, "f").cloneNode(true);
            tree.addEventListener("mousedown", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleMouseDownEvent).bind(this));
            tree.addEventListener("dragend", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleDragEndEvent).bind(this));
            tree.addEventListener("dragenter", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleDragEnterEvent).bind(this));
            tree.addEventListener("dragleave", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleDragLeaveEvent).bind(this));
            tree.addEventListener("dragover", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleDragOverEvent).bind(this));
            tree.addEventListener("drop", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleDropEvent).bind(this));
            tree.addEventListener("focus", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleFocusEvent).bind(this));
            tree.addEventListener("focusin", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleFocusInEvent).bind(this));
            tree.addEventListener("focusout", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleFocusOutEvent).bind(this));
            tree.addEventListener("keydown", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleKeyDownEvent).bind(this));
            tree.addEventListener("select", __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_handleSelectEvent).bind(this));
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_onSelection, "f").set(tree, false);
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_hasSelectionChanged, "f").set(tree, false);
            if (properties !== undefined) {
                const { id, classList, tabIndex, multisectable } = properties;
                if (id !== undefined) {
                    tree.id = id;
                }
                if (classList !== undefined) {
                    tree.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    tree.tabIndex = tabIndex;
                }
                if (multisectable !== undefined) {
                    this.setMultiSelectable(tree, multisectable);
                }
            }
            return tree;
        }
        slot(tree) {
            return tree;
        }
        slottedCallback(tree, slot) {
            const { childNodes } = slot;
            Array.from(childNodes).forEach((child_i, i) => {
                if (child_i instanceof HTMLElement && child_i.classList.contains("treeitem")) {
                    treeItemWidget.setPosInSet(child_i, i);
                    treeItemWidget.setLevel(child_i, 0);
                }
            });
        }
        items(tree) {
            return Array.from(tree.querySelectorAll(":is(:scope, :scope > .treeitemgroup) > .treeitem"));
        }
        selectedItems(tree) {
            const selectedItems = [];
            const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
            walker.currentNode = tree;
            let item = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_firstItem).call(this, tree);
            while (item !== null) {
                const selected = treeItemWidget.getSelected(item);
                if (selected) {
                    selectedItems.push(item);
                }
                item = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_nextItem).call(this, item);
            }
            return selectedItems;
        }
        beginSelection(tree) {
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_onSelection, "f").set(tree, true);
        }
        endSelection(tree) {
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_onSelection, "f").set(tree, false);
            if (__classPrivateFieldGet(this, _TreeWidgetFactoryBase_hasSelectionChanged, "f").get(tree)) {
                tree.dispatchEvent(new Event("selectionchange", { bubbles: true }));
                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_hasSelectionChanged, "f").set(tree, false);
            }
        }
        setMultiSelectable(tree, value) {
            tree.setAttribute("aria-multiselectable", String(value));
        }
        getMultiSelectable(tree) {
            return JSON.parse(tree.getAttribute("aria-multiselectable") ?? String(false));
        }
    },
    _TreeWidgetFactoryBase_template = new WeakMap(),
    _TreeWidgetFactoryBase_walker = new WeakMap(),
    _TreeWidgetFactoryBase_onSelection = new WeakMap(),
    _TreeWidgetFactoryBase_hasSelectionChanged = new WeakMap(),
    _TreeWidgetFactoryBase_instances = new WeakSet(),
    _TreeWidgetFactoryBase_getActiveItem = function _TreeWidgetFactoryBase_getActiveItem(tree) {
        return tree.querySelector(".treeitem.active");
    },
    _TreeWidgetFactoryBase_getDropTargetItem = function _TreeWidgetFactoryBase_getDropTargetItem(tree) {
        return tree.querySelector(".treeitem.droptarget");
    },
    _TreeWidgetFactoryBase_setDropTargetItem = function _TreeWidgetFactoryBase_setDropTargetItem(tree, item) {
        const { classList } = tree;
        const dropTargetItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getDropTargetItem).call(this, tree);
        if (dropTargetItem !== null && dropTargetItem !== item) {
            treeItemWidget.setDropTarget(dropTargetItem, false);
        }
        if (item !== null) {
            treeItemWidget.setDropTarget(item, true);
            classList.add("droptarget");
        }
        else {
            classList.remove("droptarget");
        }
    },
    _TreeWidgetFactoryBase_nodeFilter = function _TreeWidgetFactoryBase_nodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("treeitem") && !treeItemWidget.getDisabled(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("treeitemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _TreeWidgetFactoryBase_getItemsRange = function _TreeWidgetFactoryBase_getItemsRange(from, to) {
        if (from == to) {
            return [from];
        }
        const position = from.compareDocumentPosition(to);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            const range = [from];
            let nextItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_nextItem).call(this, from);
            while (nextItem && nextItem !== to) {
                range.push(nextItem);
                nextItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_nextItem).call(this, nextItem);
            }
            range.push(to);
            return range;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            const range = [from];
            let previousItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_previousItem).call(this, from);
            while (previousItem && previousItem !== to) {
                range.push(previousItem);
                previousItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_previousItem).call(this, previousItem);
            }
            range.push(to);
            return range;
        }
        return [];
    },
    _TreeWidgetFactoryBase_setSelection = function _TreeWidgetFactoryBase_setSelection(tree, ...items) {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        selectedItems.forEach((item_i) => {
            if (!items.includes(item_i)) {
                treeItemWidget.setSelected(item_i, false);
            }
        });
        items.forEach((item_i) => {
            const selected = treeItemWidget.getSelected(item_i);
            if (tree.contains(item_i) && !selected) {
                treeItemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(tree);
    },
    _TreeWidgetFactoryBase_addToSelection = function _TreeWidgetFactoryBase_addToSelection(tree, ...items) {
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (!treeItemWidget.getSelected(item_i)) {
                treeItemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(tree);
    },
    _TreeWidgetFactoryBase_removeFromSelection = function _TreeWidgetFactoryBase_removeFromSelection(tree, ...items) {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                treeItemWidget.setSelected(item_i, false);
            }
        });
        this.endSelection(tree);
    },
    _TreeWidgetFactoryBase_clearSelection = function _TreeWidgetFactoryBase_clearSelection(tree) {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        selectedItems.forEach((item_i) => {
            treeItemWidget.setSelected(item_i, false);
        });
        this.endSelection(tree);
    },
    _TreeWidgetFactoryBase_setActiveItem = function _TreeWidgetFactoryBase_setActiveItem(tree, item) {
        const activeItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getActiveItem).call(this, tree);
        if (activeItem !== null && activeItem !== item) {
            treeItemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            treeItemWidget.setActive(item, true);
            item.tabIndex = 0;
        }
    },
    _TreeWidgetFactoryBase_firstItem = function _TreeWidgetFactoryBase_firstItem(tree) {
        const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
        walker.currentNode = tree;
        return walker.firstChild();
    },
    _TreeWidgetFactoryBase_lastItem = function _TreeWidgetFactoryBase_lastItem(tree) {
        const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
        walker.currentNode = tree;
        return walker.lastChild();
    },
    _TreeWidgetFactoryBase_previousItem = function _TreeWidgetFactoryBase_previousItem(item) {
        const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        const previousSibling = walker.previousSibling();
        return previousSibling ?
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_deepestItem).call(this, previousSibling) :
            walker.parentNode();
    },
    _TreeWidgetFactoryBase_nextItem = function _TreeWidgetFactoryBase_nextItem(item) {
        const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
        walker.currentNode = item;
        const type = treeItemWidget.getType(item);
        const expanded = treeItemWidget.getExpanded(item);
        return (type === "leaf" ?
            walker.nextNode() :
            expanded ?
                walker.nextNode() :
                walker.nextSibling() ??
                    (walker.parentNode(), walker.nextSibling()));
    },
    _TreeWidgetFactoryBase_deepestItem = function _TreeWidgetFactoryBase_deepestItem(item) {
        const expanded = treeItemWidget.getExpanded(item);
        if (expanded) {
            const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
            const lastItem = walker.lastChild();
            if (lastItem) {
                return __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_deepestItem).call(this, lastItem);
            }
        }
        return item;
    },
    _TreeWidgetFactoryBase_handleMouseDownEvent = function _TreeWidgetFactoryBase_handleMouseDownEvent(event) {
        const { currentTarget, target, ctrlKey, shiftKey, button } = event;
        const targetTree = currentTarget;
        const targetItem = target.closest(".treeitem");
        if (targetItem) {
            const selected = treeItemWidget.getSelected(targetItem);
            switch (button) {
                case 0: {
                    if (!shiftKey && !ctrlKey) {
                        __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setSelection).call(this, targetTree, targetItem);
                    }
                    else if (ctrlKey) {
                        if (selected) {
                            targetItem.blur();
                            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_removeFromSelection).call(this, targetTree, targetItem);
                        }
                        else {
                            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_addToSelection).call(this, targetTree, targetItem);
                        }
                        event.stopPropagation();
                    }
                    else if (shiftKey) {
                        const activeItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getActiveItem).call(this, targetTree);
                        if (activeItem) {
                            const range = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getItemsRange).call(this, activeItem, targetItem);
                            if (range) {
                                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setSelection).call(this, targetTree, ...range);
                            }
                        }
                        event.stopPropagation();
                    }
                    break;
                }
                case 2: {
                    if (!selected) {
                        __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setSelection).call(this, targetTree, targetItem);
                    }
                    break;
                }
            }
        }
    },
    _TreeWidgetFactoryBase_handleDragEndEvent = function _TreeWidgetFactoryBase_handleDragEndEvent(event) {
        const { currentTarget } = event;
        const targetTree = currentTarget;
        __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setDropTargetItem).call(this, targetTree, null);
    },
    _TreeWidgetFactoryBase_handleDragEnterEvent = function _TreeWidgetFactoryBase_handleDragEnterEvent(event) {
        const { currentTarget, target } = event;
        const targetItem = target.closest(".treeitem");
        const targetTree = currentTarget;
        if (targetItem) {
            const type = treeItemWidget.getType(targetItem);
            if (type == "parent") {
                treeItemWidget.toggle(targetItem, true);
            }
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setDropTargetItem).call(this, targetTree, targetItem);
        }
        event.preventDefault();
    },
    _TreeWidgetFactoryBase_handleDragOverEvent = function _TreeWidgetFactoryBase_handleDragOverEvent(event) {
        event.preventDefault();
    },
    _TreeWidgetFactoryBase_handleDragLeaveEvent = function _TreeWidgetFactoryBase_handleDragLeaveEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetTree = currentTarget;
        if (!targetTree.contains(relatedTarget)) {
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setDropTargetItem).call(this, targetTree, null);
        }
    },
    _TreeWidgetFactoryBase_handleDropEvent = function _TreeWidgetFactoryBase_handleDropEvent(event) {
        const { currentTarget } = event;
        const targetTree = currentTarget;
        __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setDropTargetItem).call(this, targetTree, null);
    },
    _TreeWidgetFactoryBase_handleFocusEvent = function _TreeWidgetFactoryBase_handleFocusEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetTree = currentTarget;
        const focusWithin = targetTree.contains(relatedTarget);
        if (!focusWithin) {
            const activeItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getActiveItem).call(this, targetTree);
            if (activeItem) {
                activeItem.focus();
            }
        }
    },
    _TreeWidgetFactoryBase_handleFocusInEvent = function _TreeWidgetFactoryBase_handleFocusInEvent(event) {
        const { currentTarget, target } = event;
        const targetItem = target.closest(".treeitem");
        const targetTree = currentTarget;
        if (targetItem) {
            __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setActiveItem).call(this, targetTree, targetItem);
            targetTree.tabIndex = -1;
        }
    },
    _TreeWidgetFactoryBase_handleFocusOutEvent = function _TreeWidgetFactoryBase_handleFocusOutEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetTree = currentTarget;
        const lostFocusWithin = !targetTree.contains(relatedTarget);
        if (lostFocusWithin) {
            targetTree.tabIndex = 0;
        }
    },
    _TreeWidgetFactoryBase_handleKeyDownEvent = function _TreeWidgetFactoryBase_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetTree = currentTarget;
        const activeItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getActiveItem).call(this, targetTree);
        switch (key) {
            case "a": {
                const { ctrlKey } = event;
                if (ctrlKey) {
                    if (activeItem) {
                        const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
                        walker.currentNode = activeItem;
                        const firstItem = (walker.currentNode = walker.parentNode() ?? targetTree, walker.firstChild());
                        const lastItem = (walker.currentNode = walker.parentNode() ?? targetTree, walker.lastChild());
                        if (firstItem && lastItem) {
                            const range = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_getItemsRange).call(this, firstItem, __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_deepestItem).call(this, lastItem));
                            if (range) {
                                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setSelection).call(this, targetTree, ...range);
                            }
                        }
                    }
                }
                event.preventDefault();
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const expanded = treeItemWidget.getExpanded(activeItem);
                    if (expanded) {
                        treeItemWidget.toggle(activeItem);
                    }
                    else {
                        const walker = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_walker, "f");
                        const parentItem = walker.parentNode();
                        if (parentItem) {
                            parentItem.focus({ preventScroll: true });
                        }
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const expanded = treeItemWidget.getExpanded(activeItem);
                    if (!expanded) {
                        treeItemWidget.toggle(activeItem);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowUp": {
                if (activeItem) {
                    const previousItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_previousItem).call(this, activeItem);
                    if (previousItem) {
                        previousItem.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            const selected = treeItemWidget.getSelected(previousItem);
                            selected ?
                                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_removeFromSelection).call(this, targetTree, previousItem) :
                                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_addToSelection).call(this, targetTree, previousItem);
                        }
                    }
                }
                else {
                    const firstItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_firstItem).call(this, targetTree);
                    if (firstItem) {
                        firstItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (activeItem) {
                    const nextItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_nextItem).call(this, activeItem);
                    if (nextItem) {
                        nextItem.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            const selected = treeItemWidget.getSelected(nextItem);
                            selected ?
                                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_removeFromSelection).call(this, targetTree, nextItem) :
                                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_addToSelection).call(this, targetTree, nextItem);
                        }
                    }
                }
                else {
                    const lastItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_lastItem).call(this, targetTree);
                    if (lastItem) {
                        lastItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_firstItem).call(this, targetTree);
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_lastItem).call(this, targetTree);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setSelection).call(this, targetTree, activeItem);
                    activeItem.click();
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_clearSelection).call(this, targetTree);
                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_instances, "m", _TreeWidgetFactoryBase_setActiveItem).call(this, targetTree, null);
                targetTree.focus();
                event.stopPropagation();
                break;
            }
        }
    },
    _TreeWidgetFactoryBase_handleSelectEvent = function _TreeWidgetFactoryBase_handleSelectEvent(event) {
        const { target } = event;
        const targetTree = target;
        if (target instanceof HTMLElement && target.classList.contains("treeitem")) {
            if (__classPrivateFieldGet(this, _TreeWidgetFactoryBase_onSelection, "f").get(targetTree)) {
                __classPrivateFieldGet(this, _TreeWidgetFactoryBase_hasSelectionChanged, "f").set(target, true);
            }
            else {
                targetTree.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            }
        }
    },
    _a)));
//# sourceMappingURL=TreeWidget.js.map