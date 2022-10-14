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
var _HTMLETreeElementBase_instances, _HTMLETreeElementBase_onSelection, _HTMLETreeElementBase_hasSelectionChanged, _HTMLETreeElementBase_walker, _HTMLETreeElementBase_nodeFilter, _HTMLETreeElementBase_getItemsRange, _HTMLETreeElementBase_setSelection, _HTMLETreeElementBase_addToSelection, _HTMLETreeElementBase_removeFromSelection, _HTMLETreeElementBase_clearSelection, _HTMLETreeElementBase_setActiveItem, _HTMLETreeElementBase_setDropTargetItem, _HTMLETreeElementBase_lastItem, _HTMLETreeElementBase_previousItem, _HTMLETreeElementBase_nextItem, _HTMLETreeElementBase_deepestItem, _HTMLETreeElementBase_handleClickEvent, _HTMLETreeElementBase_handleContextMenuEvent, _HTMLETreeElementBase_handleDblClickEvent, _HTMLETreeElementBase_handleDragEndEvent, _HTMLETreeElementBase_handleDragEnterEvent, _HTMLETreeElementBase_handleDragOverEvent, _HTMLETreeElementBase_handleDragLeaveEvent, _HTMLETreeElementBase_handleDropEvent, _HTMLETreeElementBase_handleKeyDownEvent, _HTMLETreeElementBase_handleFocusEvent, _HTMLETreeElementBase_handleFocusInEvent, _HTMLETreeElementBase_handleFocusOutEvent, _HTMLETreeElementBase_handleMouseDownEvent, _HTMLETreeElementBase_handleSelectEvent;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLETreeItemElement } from "./TreeItem";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";
export { HTMLETreeElement };
var shadowTemplate;
var style;
let HTMLETreeElementBase = class HTMLETreeElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLETreeElementBase_instances.add(this);
        _HTMLETreeElementBase_onSelection.set(this, void 0);
        _HTMLETreeElementBase_hasSelectionChanged.set(this, void 0);
        _HTMLETreeElementBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLETreeElementBase_walker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_nodeFilter).bind(this)), "f");
        __classPrivateFieldSet(this, _HTMLETreeElementBase_onSelection, false, "f");
        __classPrivateFieldSet(this, _HTMLETreeElementBase_hasSelectionChanged, false, "f");
        this.items = this.getElementsByTagName("e-treeitem");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleClickEvent).bind(this));
        this.addEventListener("contextmenu", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleContextMenuEvent).bind(this));
        this.addEventListener("dblclick", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleDblClickEvent).bind(this));
        this.addEventListener("mousedown", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleMouseDownEvent).bind(this));
        this.addEventListener("dragend", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleDragEndEvent).bind(this));
        this.addEventListener("dragenter", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleDragEnterEvent).bind(this));
        this.addEventListener("dragleave", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleDragLeaveEvent).bind(this));
        this.addEventListener("dragover", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleDragOverEvent).bind(this));
        this.addEventListener("drop", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleDropEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("focusout", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleFocusOutEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleKeyDownEvent).bind(this));
        this.addEventListener("select", __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_handleSelectEvent).bind(this));
    }
    get activeItem() {
        return this.querySelector("e-treeitem[active]");
    }
    get dropTargetItem() {
        return this.querySelector("e-treeitem[droptarget]");
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    selectedItems() {
        const selectedItems = [];
        const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
        walker.currentNode = walker.root;
        let item = this.firstItem();
        while (item !== null) {
            if (item.selected) {
                selectedItems.push(item);
            }
            item = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_nextItem).call(this, item);
        }
        return selectedItems;
    }
    beginSelection() {
        __classPrivateFieldSet(this, _HTMLETreeElementBase_onSelection, true, "f");
    }
    endSelection() {
        __classPrivateFieldSet(this, _HTMLETreeElementBase_onSelection, false, "f");
        if (__classPrivateFieldGet(this, _HTMLETreeElementBase_hasSelectionChanged, "f")) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            __classPrivateFieldSet(this, _HTMLETreeElementBase_hasSelectionChanged, false, "f");
        }
    }
    firstItem() {
        const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
        const { root } = walker;
        walker.currentNode = root;
        return walker.firstChild();
    }
};
_HTMLETreeElementBase_onSelection = new WeakMap(), _HTMLETreeElementBase_hasSelectionChanged = new WeakMap(), _HTMLETreeElementBase_walker = new WeakMap(), _HTMLETreeElementBase_instances = new WeakSet(), _HTMLETreeElementBase_nodeFilter = function _HTMLETreeElementBase_nodeFilter(node) {
    if (node instanceof HTMLETreeItemElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLETreeItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLETreeElementBase_getItemsRange = function _HTMLETreeElementBase_getItemsRange(from, to) {
    if (from == to) {
        return [from];
    }
    const position = from.compareDocumentPosition(to);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        const range = [from];
        let nextVisibleItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_nextItem).call(this, from);
        while (nextVisibleItem && nextVisibleItem !== to) {
            range.push(nextVisibleItem);
            nextVisibleItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_nextItem).call(this, nextVisibleItem);
        }
        range.push(to);
        return range;
    }
    else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        const range = [from];
        let previousVisibleItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_previousItem).call(this, from);
        while (previousVisibleItem && previousVisibleItem !== to) {
            range.push(previousVisibleItem);
            previousVisibleItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_previousItem).call(this, previousVisibleItem);
        }
        range.push(to);
        return range;
    }
    return [];
}, _HTMLETreeElementBase_setSelection = function _HTMLETreeElementBase_setSelection(...items) {
    const selectedItems = this.selectedItems();
    this.beginSelection();
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
}, _HTMLETreeElementBase_addToSelection = function _HTMLETreeElementBase_addToSelection(...items) {
    this.beginSelection();
    items.forEach((item_i) => {
        if (!item_i.selected) {
            item_i.selected = true;
        }
    });
    this.endSelection();
}, _HTMLETreeElementBase_removeFromSelection = function _HTMLETreeElementBase_removeFromSelection(...items) {
    const selectedItems = this.selectedItems();
    this.beginSelection();
    items.forEach((item_i) => {
        if (selectedItems.includes(item_i)) {
            item_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLETreeElementBase_clearSelection = function _HTMLETreeElementBase_clearSelection() {
    const selectedItems = this.selectedItems();
    this.beginSelection();
    selectedItems.forEach((item_i) => {
        item_i.selected = false;
    });
    this.endSelection();
}, _HTMLETreeElementBase_setActiveItem = function _HTMLETreeElementBase_setActiveItem(item) {
    const { activeItem } = this;
    if (activeItem !== null && activeItem !== item) {
        activeItem.active = false;
        activeItem.tabIndex = -1;
    }
    if (item !== null) {
        const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
        walker.currentNode = item;
        item.active = true;
        item.tabIndex = 0;
    }
}, _HTMLETreeElementBase_setDropTargetItem = function _HTMLETreeElementBase_setDropTargetItem(item) {
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
}, _HTMLETreeElementBase_lastItem = function _HTMLETreeElementBase_lastItem() {
    const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
    const { root } = walker;
    walker.currentNode = root;
    return walker.lastChild();
}, _HTMLETreeElementBase_previousItem = function _HTMLETreeElementBase_previousItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
    walker.currentNode = item;
    const previousSibling = walker.previousSibling();
    return previousSibling ?
        __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_deepestItem).call(this, previousSibling) :
        walker.parentNode();
}, _HTMLETreeElementBase_nextItem = function _HTMLETreeElementBase_nextItem(item) {
    const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
    walker.currentNode = item;
    const { type, expanded } = item;
    return (type === "leaf" ?
        walker.nextNode() :
        expanded ?
            walker.nextNode() :
            walker.nextSibling() ??
                (walker.parentNode(), walker.nextSibling()));
}, _HTMLETreeElementBase_deepestItem = function _HTMLETreeElementBase_deepestItem(item) {
    if (item.expanded) {
        const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
        const lastItem = walker.lastChild();
        if (lastItem) {
            return __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_deepestItem).call(this, lastItem);
        }
    }
    return item;
}, _HTMLETreeElementBase_handleClickEvent = function _HTMLETreeElementBase_handleClickEvent(event) {
    const { target, shiftKey, ctrlKey } = event;
    const targetItem = target.closest("e-treeitem");
    if (targetItem) {
        if (!shiftKey && !ctrlKey) {
            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setSelection).call(this, targetItem);
            const { type } = targetItem;
            if (type == "parent") {
                targetItem.toggle();
            }
        }
    }
    event.stopPropagation();
}, _HTMLETreeElementBase_handleContextMenuEvent = function _HTMLETreeElementBase_handleContextMenuEvent(event) {
    event.stopPropagation();
}, _HTMLETreeElementBase_handleDblClickEvent = function _HTMLETreeElementBase_handleDblClickEvent(event) {
    event.stopPropagation();
}, _HTMLETreeElementBase_handleDragEndEvent = function _HTMLETreeElementBase_handleDragEndEvent() {
    __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setDropTargetItem).call(this, null);
}, _HTMLETreeElementBase_handleDragEnterEvent = function _HTMLETreeElementBase_handleDragEnterEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-treeitem");
    if (targetItem) {
        const { type } = targetItem;
        if (type == "parent") {
            targetItem.toggle(true);
        }
        __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setDropTargetItem).call(this, targetItem);
    }
    event.preventDefault();
}, _HTMLETreeElementBase_handleDragOverEvent = function _HTMLETreeElementBase_handleDragOverEvent(event) {
    event.preventDefault();
}, _HTMLETreeElementBase_handleDragLeaveEvent = function _HTMLETreeElementBase_handleDragLeaveEvent(event) {
    const { relatedTarget } = event;
    if (relatedTarget) {
        const relatedTargetRoot = relatedTarget.getRootNode();
        const relatedTargetHost = relatedTargetRoot instanceof ShadowRoot ?
            relatedTargetRoot.host :
            relatedTarget;
        if (!this.contains(relatedTargetHost)) {
            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setDropTargetItem).call(this, null);
        }
    }
}, _HTMLETreeElementBase_handleDropEvent = function _HTMLETreeElementBase_handleDropEvent() {
    __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setDropTargetItem).call(this, null);
}, _HTMLETreeElementBase_handleKeyDownEvent = function _HTMLETreeElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { activeItem } = this;
    switch (key) {
        case "a": {
            const { ctrlKey } = event;
            if (ctrlKey) {
                if (activeItem) {
                    const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
                    const { root } = walker;
                    walker.currentNode = activeItem;
                    const firstItem = (walker.currentNode = walker.parentNode() ?? root, walker.firstChild());
                    const lastItem = (walker.currentNode = walker.parentNode() ?? root, walker.lastChild());
                    if (firstItem && lastItem) {
                        const range = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_getItemsRange).call(this, firstItem, __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_deepestItem).call(this, lastItem));
                        if (range) {
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setSelection).call(this, ...range);
                        }
                    }
                }
            }
            event.preventDefault();
            break;
        }
        case "ArrowLeft": {
            if (activeItem) {
                if (activeItem.expanded) {
                    activeItem.toggle();
                }
                else {
                    const walker = __classPrivateFieldGet(this, _HTMLETreeElementBase_walker, "f");
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
                if (!activeItem.expanded) {
                    activeItem.toggle();
                }
            }
            event.stopPropagation();
            break;
        }
        case "ArrowUp": {
            if (activeItem) {
                const previousItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_previousItem).call(this, activeItem);
                if (previousItem) {
                    previousItem.focus({ preventScroll: true });
                    const { shiftKey } = event;
                    if (shiftKey) {
                        previousItem.selected ?
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_removeFromSelection).call(this, previousItem) :
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_addToSelection).call(this, previousItem);
                    }
                }
            }
            else {
                const firstItem = this.firstItem();
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
            break;
        }
        case "ArrowDown": {
            if (activeItem) {
                const nextItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_nextItem).call(this, activeItem);
                if (nextItem) {
                    nextItem.focus({ preventScroll: true });
                    const { shiftKey } = event;
                    if (shiftKey) {
                        nextItem.selected ?
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_removeFromSelection).call(this, nextItem) :
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_addToSelection).call(this, nextItem);
                    }
                }
            }
            else {
                const lastItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_lastItem).call(this);
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
            }
            event.stopPropagation();
            break;
        }
        case "Home": {
            const firstItem = this.firstItem();
            if (firstItem) {
                firstItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "End": {
            const lastItem = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_lastItem).call(this);
            if (lastItem) {
                lastItem.focus({ preventScroll: true });
            }
            event.stopPropagation();
            break;
        }
        case "Enter": {
            if (activeItem) {
                __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setSelection).call(this, activeItem);
                activeItem.click();
            }
            event.stopPropagation();
            break;
        }
        case "Escape": {
            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_clearSelection).call(this);
            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setActiveItem).call(this, null);
            this.focus();
            event.stopPropagation();
            break;
        }
    }
}, _HTMLETreeElementBase_handleFocusEvent = function _HTMLETreeElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { activeItem } = this;
    if (!this.contains(relatedTarget)) {
        (activeItem ?? this.firstItem())?.focus();
    }
}, _HTMLETreeElementBase_handleFocusInEvent = function _HTMLETreeElementBase_handleFocusInEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-treeitem");
    if (targetItem) {
        __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setActiveItem).call(this, targetItem);
        this.tabIndex = -1;
    }
}, _HTMLETreeElementBase_handleFocusOutEvent = function _HTMLETreeElementBase_handleFocusOutEvent(event) {
    const { relatedTarget } = event;
    const lostFocusWithin = !this.contains(relatedTarget);
    if (lostFocusWithin) {
        this.tabIndex = 0;
    }
}, _HTMLETreeElementBase_handleMouseDownEvent = function _HTMLETreeElementBase_handleMouseDownEvent(event) {
    const { target, ctrlKey, shiftKey, button } = event;
    if (target instanceof HTMLETreeItemElement) {
        const { selected } = target;
        switch (button) {
            case 0:
                {
                    if (!shiftKey && !ctrlKey && !selected) {
                        __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setSelection).call(this, target);
                    }
                    else if (ctrlKey) {
                        if (selected) {
                            target.blur();
                        }
                        (!selected) ?
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_addToSelection).call(this, target) :
                            __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_removeFromSelection).call(this, target);
                        event.stopPropagation();
                    }
                    else if (shiftKey) {
                        const { activeItem } = this;
                        if (activeItem) {
                            const range = __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_getItemsRange).call(this, activeItem, target);
                            if (range) {
                                __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setSelection).call(this, ...range);
                            }
                        }
                        event.stopPropagation();
                    }
                }
                break;
            case 2: {
                if (!selected) {
                    __classPrivateFieldGet(this, _HTMLETreeElementBase_instances, "m", _HTMLETreeElementBase_setSelection).call(this, target);
                }
                break;
            }
        }
    }
}, _HTMLETreeElementBase_handleSelectEvent = function _HTMLETreeElementBase_handleSelectEvent() {
    if (__classPrivateFieldGet(this, _HTMLETreeElementBase_onSelection, "f")) {
        __classPrivateFieldSet(this, _HTMLETreeElementBase_hasSelectionChanged, true, "f");
    }
    else {
        this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                display: block;
            }
            
            :host(:focus) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETreeElementBase.prototype, "droptarget", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLETreeElementBase.prototype, "name", void 0);
HTMLETreeElementBase = __decorate([
    CustomElement({
        name: "e-tree"
    })
], HTMLETreeElementBase);
var HTMLETreeElement = HTMLETreeElementBase;
//# sourceMappingURL=Tree.js.map