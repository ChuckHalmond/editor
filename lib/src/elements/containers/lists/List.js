var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HTMLEListElementBase_instances, _HTMLEListElementBase_onSelection, _HTMLEListElementBase_hasSelectionChanged, _HTMLEListElementBase_walker, _HTMLEListElementBase_walkerNodeFilter, _HTMLEListElementBase_getItemsRange, _HTMLEListElementBase_setSelection, _HTMLEListElementBase_addToSelection, _HTMLEListElementBase_removeFromSelection, _HTMLEListElementBase_clearSelection, _HTMLEListElementBase_setActiveItem, _HTMLEListElementBase_setDropTargetItem, _HTMLEListElementBase_firstItem, _HTMLEListElementBase_lastItem, _HTMLEListElementBase_previousItem, _HTMLEListElementBase_nextItem, _HTMLEListElementBase_handleContextMenuEvent, _HTMLEListElementBase_handleDragEndEvent, _HTMLEListElementBase_handleDragEnterEvent, _HTMLEListElementBase_handleDragOverEvent, _HTMLEListElementBase_handleDragLeaveEvent, _HTMLEListElementBase_handleDragStartEvent, _HTMLEListElementBase_handleDropEvent, _HTMLEListElementBase_handleFocusEvent, _HTMLEListElementBase_handleFocusInEvent, _HTMLEListElementBase_handleKeyDownEvent, _HTMLEListElementBase_handleMouseDownEvent, _HTMLEListElementBase_handleSelectEvent, _HTMLEListElementBase_handleSlotChangeEvent;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEListItemElement } from "./ListItem";
import { HTMLEListItemGroupElement } from "./ListItemGroup";
export { HTMLEListElement };
var shadowTemplate;
let HTMLEListElementBase = class HTMLEListElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEListElementBase_instances.add(this);
        _HTMLEListElementBase_onSelection.set(this, void 0);
        _HTMLEListElementBase_hasSelectionChanged.set(this, void 0);
        _HTMLEListElementBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEListElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_walkerNodeFilter).bind(this)), "f");
        __classPrivateFieldSet(this, _HTMLEListElementBase_onSelection, false, "f");
        __classPrivateFieldSet(this, _HTMLEListElementBase_hasSelectionChanged, false, "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("contextmenu", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleContextMenuEvent).bind(this));
        this.addEventListener("dragend", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleDragEndEvent).bind(this));
        this.addEventListener("dragenter", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleDragEnterEvent).bind(this));
        this.addEventListener("dragover", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleDragOverEvent).bind(this));
        this.addEventListener("dragleave", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleDragLeaveEvent).bind(this));
        this.addEventListener("dragstart", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleDragStartEvent).bind(this));
        this.addEventListener("drop", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleDropEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleKeyDownEvent).bind(this));
        this.addEventListener("mousedown", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleMouseDownEvent).bind(this));
        this.addEventListener("select", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleSelectEvent).bind(this));
        shadowRoot.addEventListener("slotchange", __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_handleSlotChangeEvent).bind(this));
    }
    get activeItem() {
        return this.querySelector("e-listitem[active]");
    }
    get dropTargetItem() {
        return this.querySelector("e-listitem[droptarget]");
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-listitemgroup) > e-listitem"));
    }
    connectedCallback() {
        const tabIndex = this.getAttribute("tabindex");
        this.tabIndex = tabIndex === null ? 0 : parseInt(tabIndex);
    }
    beginSelection() {
        __classPrivateFieldSet(this, _HTMLEListElementBase_onSelection, true, "f");
    }
    endSelection() {
        __classPrivateFieldSet(this, _HTMLEListElementBase_onSelection, false, "f");
        if (__classPrivateFieldGet(this, _HTMLEListElementBase_hasSelectionChanged, "f")) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            __classPrivateFieldSet(this, _HTMLEListElementBase_hasSelectionChanged, false, "f");
        }
    }
    selectedItems() {
        const selectedItems = [];
        const walker = __classPrivateFieldGet(this, _HTMLEListElementBase_walker, "f");
        walker.currentNode = walker.root;
        let item = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_firstItem).call(this);
        while (item !== null) {
            if (item.selected) {
                selectedItems.push(item);
            }
            item = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_nextItem).call(this, item);
        }
        return selectedItems;
    }
};
_HTMLEListElementBase_onSelection = new WeakMap(), _HTMLEListElementBase_hasSelectionChanged = new WeakMap(), _HTMLEListElementBase_walker = new WeakMap(), _HTMLEListElementBase_instances = new WeakSet(), _HTMLEListElementBase_walkerNodeFilter = function _HTMLEListElementBase_walkerNodeFilter(node) {
    if (node instanceof HTMLEListItemElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEListItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEListElementBase_getItemsRange = function _HTMLEListElementBase_getItemsRange(from, to) {
    const items = this.items();
    const fromIndex = items.indexOf(from);
    const toIndex = items.indexOf(to);
    if (fromIndex > -1 && toIndex > -1) {
        if (from == to) {
            return [from];
        }
        return items.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
    }
    return [];
}, _HTMLEListElementBase_setSelection = function _HTMLEListElementBase_setSelection(...items) {
    this.beginSelection();
    const selectedItems = this.selectedItems();
    selectedItems.forEach((selectedItem_i) => {
        if (!items.includes(selectedItem_i)) {
            selectedItem_i.selected = false;
        }
    });
    items.forEach((item_i) => {
        if (this.contains(item_i) && !item_i.selected) {
            item_i.selected = true;
        }
    });
    this.endSelection();
}, _HTMLEListElementBase_addToSelection = function _HTMLEListElementBase_addToSelection(...items) {
    this.beginSelection();
    items.forEach((item_i) => {
        if (!item_i.selected) {
            item_i.selected = true;
        }
    });
    this.endSelection();
}, _HTMLEListElementBase_removeFromSelection = function _HTMLEListElementBase_removeFromSelection(...items) {
    this.beginSelection();
    const selectedItems = this.selectedItems();
    items.forEach((item_i) => {
        if (selectedItems.includes(item_i)) {
            item_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLEListElementBase_clearSelection = function _HTMLEListElementBase_clearSelection() {
    this.beginSelection();
    const selectedItems = this.selectedItems();
    selectedItems.forEach((item_i) => {
        if (item_i.selected) {
            item_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLEListElementBase_setActiveItem = function _HTMLEListElementBase_setActiveItem(item) {
    const { activeItem, items } = this;
    if (activeItem !== null && activeItem !== item) {
        activeItem.active = false;
        activeItem.tabIndex = -1;
    }
    if (item !== null) {
        item.active = true;
        item.tabIndex = 0;
    }
}, _HTMLEListElementBase_setDropTargetItem = function _HTMLEListElementBase_setDropTargetItem(item) {
    const { dropTargetItem } = this;
    if (dropTargetItem !== null && dropTargetItem !== item) {
        dropTargetItem.droptarget = false;
    }
    if (item !== null) {
        this.droptarget = true;
        item.droptarget = true;
    }
    else {
        this.droptarget = false;
    }
}, _HTMLEListElementBase_firstItem = function _HTMLEListElementBase_firstItem() {
    const walker = __classPrivateFieldGet(this, _HTMLEListElementBase_walker, "f");
    const { root } = walker;
    walker.currentNode = root;
    return walker.firstChild();
}, _HTMLEListElementBase_lastItem = function _HTMLEListElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLEListElementBase_walker, "f");
    const { root } = walker;
    walker.currentNode = root;
    return walker.lastChild();
}, _HTMLEListElementBase_previousItem = function _HTMLEListElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEListElementBase_walker, "f");
    walker.currentNode = item;
    const previousItem = walker.previousNode();
    return previousItem;
}, _HTMLEListElementBase_nextItem = function _HTMLEListElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLEListElementBase_walker, "f");
    walker.currentNode = item;
    const nextItem = walker.nextNode();
    return nextItem;
}, _HTMLEListElementBase_handleContextMenuEvent = function _HTMLEListElementBase_handleContextMenuEvent(event) {
    const { target } = event;
    if (target instanceof HTMLEListItemElement) {
        const selectedItems = this.selectedItems();
        if (!selectedItems.includes(target)) {
            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setSelection).call(this, target);
        }
        target.focus({ preventScroll: true });
        event.preventDefault();
    }
}, _HTMLEListElementBase_handleDragEndEvent = function _HTMLEListElementBase_handleDragEndEvent() {
    __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setDropTargetItem).call(this, null);
}, _HTMLEListElementBase_handleDragEnterEvent = function _HTMLEListElementBase_handleDragEnterEvent(event) {
    const { target } = event;
    if (target instanceof HTMLEListItemElement) {
        __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setDropTargetItem).call(this, target);
    }
    event.preventDefault();
}, _HTMLEListElementBase_handleDragOverEvent = function _HTMLEListElementBase_handleDragOverEvent(event) {
    event.preventDefault();
}, _HTMLEListElementBase_handleDragLeaveEvent = function _HTMLEListElementBase_handleDragLeaveEvent(event) {
    const { relatedTarget } = event;
    const relatedTargetRoot = relatedTarget.getRootNode();
    const relatedTargetHost = relatedTargetRoot instanceof ShadowRoot ?
        relatedTargetRoot.host :
        relatedTarget;
    if (!this.contains(relatedTargetHost)) {
        __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setDropTargetItem).call(this, null);
    }
}, _HTMLEListElementBase_handleDragStartEvent = function _HTMLEListElementBase_handleDragStartEvent(event) {
    const { target } = event;
    if (target instanceof HTMLEListItemElement) {
        const selectedItems = this.selectedItems();
        if (!selectedItems.includes(target)) {
            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setSelection).call(this, target);
        }
    }
}, _HTMLEListElementBase_handleDropEvent = function _HTMLEListElementBase_handleDropEvent() {
    __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setDropTargetItem).call(this, null);
}, _HTMLEListElementBase_handleFocusEvent = function _HTMLEListElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { activeItem } = this;
    if (activeItem && relatedTarget !== activeItem) {
        activeItem.focus();
    }
}, _HTMLEListElementBase_handleFocusInEvent = function _HTMLEListElementBase_handleFocusInEvent(event) {
    const { target } = event;
    if (target instanceof HTMLEListItemElement) {
        __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setActiveItem).call(this, target);
    }
}, _HTMLEListElementBase_handleKeyDownEvent = function _HTMLEListElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { activeItem } = this;
    switch (key) {
        case "a": {
            const { ctrlKey } = event;
            if (ctrlKey) {
                const walker = __classPrivateFieldGet(this, _HTMLEListElementBase_walker, "f");
                const { root } = walker;
                const firstItem = (walker.currentNode = walker.parentNode() ?? root, walker.firstChild());
                const lastItem = (walker.currentNode = walker.parentNode() ?? root, walker.lastChild());
                const range = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_getItemsRange).call(this, firstItem, lastItem);
                if (range) {
                    __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setSelection).call(this, ...range);
                }
            }
            event.preventDefault();
            break;
        }
        case "ArrowUp": {
            if (activeItem) {
                const previousItem = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_previousItem).call(this, activeItem);
                if (previousItem) {
                    previousItem.focus({ preventScroll: true });
                    const { shiftKey } = event;
                    if (shiftKey) {
                        previousItem.selected ?
                            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_removeFromSelection).call(this, previousItem) :
                            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_addToSelection).call(this, previousItem);
                    }
                }
            }
            else {
                const firstItem = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_firstItem).call(this);
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
            break;
        }
        case "ArrowDown": {
            if (activeItem) {
                const nextItem = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_nextItem).call(this, activeItem);
                if (nextItem) {
                    nextItem.focus({ preventScroll: true });
                    const { shiftKey } = event;
                    if (shiftKey) {
                        nextItem.selected ?
                            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_removeFromSelection).call(this, nextItem) :
                            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_addToSelection).call(this, nextItem);
                    }
                }
            }
            else {
                const lastItem = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_lastItem).call(this);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
            break;
        }
        case "Home": {
            const firstItem = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_firstItem).call(this);
            if (firstItem) {
                firstItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "End": {
            const lastItem = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_lastItem).call(this);
            if (lastItem) {
                lastItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "Enter": {
            const { activeItem } = this;
            if (activeItem) {
                __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setSelection).call(this, activeItem);
                activeItem.click();
            }
            event.stopPropagation();
            break;
        }
        case "Escape": {
            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_clearSelection).call(this);
            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setActiveItem).call(this, null);
            this.focus();
            event.stopPropagation();
            break;
        }
    }
}, _HTMLEListElementBase_handleMouseDownEvent = function _HTMLEListElementBase_handleMouseDownEvent(event) {
    const { target, ctrlKey, shiftKey } = event;
    const selectedItems = this.selectedItems();
    if (target instanceof HTMLEListItemElement) {
        if (!shiftKey && !ctrlKey) {
            __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setSelection).call(this, target);
        }
        else if (ctrlKey) {
            (!target.selected) ?
                __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_addToSelection).call(this, target) :
                __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_removeFromSelection).call(this, target);
            event.stopPropagation();
        }
        else if (shiftKey) {
            const lastSelectedItem = selectedItems[selectedItems.length - 1];
            if (lastSelectedItem) {
                const range = __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_getItemsRange).call(this, lastSelectedItem, target);
                if (range) {
                    if (selectedItems.includes(target)) {
                        __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_removeFromSelection).call(this, ...range);
                    }
                    else {
                        __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_addToSelection).call(this, ...range);
                    }
                }
            }
            else {
                __classPrivateFieldGet(this, _HTMLEListElementBase_instances, "m", _HTMLEListElementBase_setSelection).call(this, target);
            }
            event.stopPropagation();
        }
    }
}, _HTMLEListElementBase_handleSelectEvent = function _HTMLEListElementBase_handleSelectEvent() {
    if (!__classPrivateFieldGet(this, _HTMLEListElementBase_onSelection, "f")) {
        this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
    }
}, _HTMLEListElementBase_handleSlotChangeEvent = function _HTMLEListElementBase_handleSlotChangeEvent(event) {
    const { target } = event;
    const assignedItems = target
        .assignedElements()
        .filter(element_i => element_i instanceof HTMLEListItemElement);
    assignedItems.forEach((item_i, i) => {
        item_i.posinset = i;
    });
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("style", {
        children: [
            /*css*/ `

                    `
        ]
    }), element("slot", {
        children: [
            element("slot")
        ]
    }));
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEListElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEListElementBase.prototype, "droptarget", void 0);
HTMLEListElementBase = __decorate([
    CustomElement({
        name: "e-list"
    })
], HTMLEListElementBase);
var HTMLEListElement = HTMLEListElementBase;
//# sourceMappingURL=List.js.map