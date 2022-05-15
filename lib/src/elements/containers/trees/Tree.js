var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HTMLETreeElementBase_1;
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLETreeItemElement } from "./TreeItem";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";
export { HTMLETreeElement };
let HTMLETreeElementBase = HTMLETreeElementBase_1 = class HTMLETreeElementBase extends HTMLElement {
    droptarget;
    name;
    #group;
    #droptarget;
    #activeItem;
    #onSelection;
    shadowRoot;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: block;
                        }

                        :host([droptarget]) {
                            background-color: gainsboro;
                        }
                    `
            }
        }), HTML("slot", {
            properties: {
                name: "group"
            }
        }));
        this.#group = null;
        this.#activeItem = null;
        this.#droptarget = null;
        this.#onSelection = false;
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("dragend", this.#handleDragEndEvent.bind(this));
        this.addEventListener("dragenter", this.#handleDragEnterEvent.bind(this));
        this.addEventListener("dragover", this.#handleDragOverEvent.bind(this));
        this.addEventListener("dragleave", this.#handleDragLeaveEvent.bind(this));
        this.addEventListener("dragstart", this.#handleDragStartEvent.bind(this));
        this.addEventListener("drop", this.#handleDropEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    get group() {
        return this.#group;
    }
    get activeItem() {
        return this.#activeItem;
    }
    selectedItems() {
        const { group } = this;
        if (group) {
            const { items } = group;
            return items.concat(items.flatMap(item_i => HTMLETreeElementBase_1.prototype.selectedItems.call(item_i))).filter(item_i => item_i.selected);
        }
        return [];
    }
    getItemsRange(from, to) {
        const containsItems = this.contains(from) && this.contains(to);
        if (containsItems) {
            if (from === to) {
                return [from];
            }
            const position = from.compareDocumentPosition(to);
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                const range = [from];
                let nextVisibleItem = this.#nextItem(from);
                while (nextVisibleItem && nextVisibleItem !== to) {
                    range.push(nextVisibleItem);
                    nextVisibleItem = this.#nextItem(nextVisibleItem);
                }
                range.push(to);
                return range;
            }
            else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                const range = [from];
                let previousVisibleItem = this.#previousItem(from);
                while (previousVisibleItem && previousVisibleItem !== to) {
                    range.push(previousVisibleItem);
                    previousVisibleItem = this.#previousItem(previousVisibleItem);
                }
                range.push(to);
                return range;
            }
        }
        return [];
    }
    setSelection(...items) {
        let hasSelectionChanged = false;
        const selectedItems = this.selectedItems();
        selectedItems.forEach((selectedItem_i) => {
            if (!items.includes(selectedItem_i)) {
                selectedItem_i.selected = false;
                hasSelectionChanged = true;
            }
        });
        items.forEach((item_i) => {
            if (this.contains(item_i) && !item_i.selected) {
                item_i.selected = true;
                hasSelectionChanged = true;
            }
        });
        if (hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
        }
    }
    addToSelection(...items) {
        let hasSelectionChanged = false;
        this.#onSelection = true;
        items.forEach((item_i) => {
            if (!item_i.selected) {
                item_i.selected = true;
                hasSelectionChanged = true;
            }
        });
        this.#onSelection = false;
        if (hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
        }
    }
    removeFromSelection(...items) {
        const selectedItems = this.selectedItems();
        let hasSelectionChanged = false;
        this.#onSelection = true;
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                item_i.selected = false;
                hasSelectionChanged = true;
            }
        });
        this.#onSelection = false;
        if (hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
        }
    }
    clearSelection() {
        const selectedItems = this.selectedItems();
        let hasSelectionChanged = false;
        this.#onSelection = true;
        selectedItems.forEach((item) => {
            if (item.selected) {
                item.selected = false;
                hasSelectionChanged = true;
            }
        });
        this.#onSelection = false;
        if (hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
        }
    }
    #parentItem(item) {
        const { parentElement: parentGroup } = item;
        if (parentGroup instanceof HTMLETreeItemGroupElement) {
            const { parentElement: parentItem } = parentGroup;
            if (parentItem instanceof HTMLETreeItemElement) {
                return parentItem;
            }
            return null;
        }
        return null;
    }
    #previousItem(item) {
        const { parentElement } = item;
        const { index } = item;
        if (parentElement instanceof HTMLETreeItemGroupElement) {
            const { items } = parentElement;
            if (index > 0) {
                const previousItem = items[index - 1];
                return this.#deepestItem(previousItem);
            }
            if (parentElement instanceof HTMLETreeElement) {
                return null;
            }
            const { parentElement: parentItem } = parentElement;
            if (parentItem instanceof HTMLETreeItemElement) {
                return parentItem;
            }
            return null;
        }
        return null;
    }
    #nextItem(item) {
        const { group: itemGroup } = item;
        if (item.expanded && itemGroup) {
            const { items: parentItems } = itemGroup;
            if (parentItems.length > 0) {
                const firstItem = parentItems[0];
                return firstItem;
            }
        }
        let childItem = item;
        let { parentElement: parentGroup } = item;
        while (parentGroup instanceof HTMLETreeItemGroupElement) {
            const { items: parentItems } = parentGroup;
            const childIndex = childItem.index;
            if (childIndex < parentItems.length - 1) {
                const nextItem = parentItems[childIndex + 1];
                return nextItem;
            }
            if (parentGroup instanceof HTMLETreeElement) {
                return null;
            }
            const { parentElement: parentItem } = parentGroup;
            if (parentItem instanceof HTMLETreeItemElement) {
                childItem = parentItem;
                ({ parentElement: parentGroup } = parentItem);
            }
            else {
                return null;
            }
        }
        return null;
    }
    #deepestItem(item) {
        const { group } = item;
        if (item.expanded && group) {
            const { items } = group;
            const lastItem = items[items.length - 1];
            if (lastItem) {
                return this.#deepestItem(lastItem);
            }
        }
        return item;
    }
    #firstItem() {
        const { group } = this;
        if (group) {
            const { items } = group;
            const firstItem = items[0];
            return firstItem ?? null;
        }
        return null;
    }
    #lastItem() {
        const { group } = this;
        if (group) {
            const { items } = group;
            const lastItem = items[items.length - 1];
            if (lastItem) {
                return this.#deepestItem(lastItem);
            }
        }
        return null;
    }
    #setActiveItem(item) {
        const activeItem = this.#activeItem;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null) {
            item.active = true;
            this.#activeItem = item;
        }
        else {
            this.#activeItem = null;
        }
    }
    #setDropTarget(target) {
        const dropTarget = this.#droptarget;
        if (dropTarget !== null && dropTarget !== target) {
            dropTarget.droptarget = false;
        }
        if (target !== null) {
            target.droptarget = true;
            this.#droptarget = target;
        }
        else {
            this.#droptarget = null;
        }
    }
    #handleContextMenuEvent(event) {
        const { target } = event;
        if (target instanceof HTMLETreeItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.setSelection(target);
            }
            target.focus({ preventScroll: true });
            event.preventDefault();
        }
    }
    #handleSelectEvent() {
        if (!this.#onSelection) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
        }
    }
    #handleClickEvent(event) {
        const { target, ctrlKey, shiftKey } = event;
        const selectedItems = this.selectedItems();
        if (target instanceof HTMLETreeItemElement) {
            if (!shiftKey && !ctrlKey) {
                this.setSelection(target);
            }
            else if (ctrlKey) {
                (!target.selected) ?
                    this.addToSelection(target) :
                    this.removeFromSelection(target);
                event.stopPropagation();
            }
            else if (shiftKey) {
                const lastSelectedItem = selectedItems[selectedItems.length - 1];
                if (lastSelectedItem) {
                    const range = this.getItemsRange(lastSelectedItem, target);
                    if (range) {
                        if (selectedItems.includes(target)) {
                            this.removeFromSelection(...range);
                        }
                        else {
                            this.addToSelection(...range);
                        }
                    }
                }
                else {
                    this.setSelection(target);
                }
                event.stopPropagation();
            }
        }
    }
    #handleDragEndEvent() {
        this.#setDropTarget(null);
    }
    #handleDragEnterEvent(event) {
        const { target } = event;
        if (target instanceof HTMLETreeItemElement) {
            const { type } = target;
            if (type === "parent") {
                this.#setDropTarget(target);
            }
            else {
                const { parentElement: parentItem } = target;
                const { type: parentType } = target;
                if (parentItem instanceof HTMLETreeItemElement && parentType === "parent") {
                    this.#setDropTarget(parentItem);
                }
                else {
                    this.#setDropTarget(this);
                }
            }
        }
        event.preventDefault();
    }
    #handleDragOverEvent(event) {
        event.preventDefault();
    }
    #handleDragLeaveEvent(event) {
        const { relatedTarget } = event;
        const relatedTargetRoot = relatedTarget.getRootNode();
        const relatedTargetHost = relatedTargetRoot instanceof ShadowRoot ?
            relatedTargetRoot.host :
            relatedTarget;
        if (!this.contains(relatedTargetHost)) {
            this.#setDropTarget(null);
        }
    }
    #handleDragStartEvent(event) {
        const { target } = event;
        if (target instanceof HTMLETreeItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.setSelection(target);
            }
        }
    }
    #handleDropEvent() {
        this.#setDropTarget(null);
    }
    #handleKeyDownEvent(event) {
        const { key } = event;
        const { activeItem } = this;
        switch (key) {
            case "a": {
                const { ctrlKey } = event;
                if (ctrlKey) {
                    if (activeItem) {
                        const { parentElement: parentGroup } = activeItem;
                        if (parentGroup instanceof HTMLETreeItemGroupElement) {
                            const { items } = parentGroup;
                            const firstItem = items[0];
                            const lastItem = items[items.length - 1];
                            const range = this.getItemsRange(firstItem, this.#deepestItem(lastItem));
                            if (range) {
                                this.setSelection(...range);
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
                        const parentItem = this.#parentItem(activeItem);
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
                    const previousItem = this.#previousItem(activeItem);
                    if (previousItem) {
                        previousItem.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            previousItem.selected ?
                                this.removeFromSelection(previousItem) :
                                this.addToSelection(previousItem);
                        }
                    }
                }
                else {
                    const firstItem = this.#firstItem();
                    if (firstItem) {
                        firstItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (activeItem) {
                    const nextItem = this.#nextItem(activeItem);
                    if (nextItem) {
                        nextItem.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            nextItem.selected ?
                                this.removeFromSelection(nextItem) :
                                this.addToSelection(nextItem);
                        }
                    }
                }
                else {
                    const lastItem = this.#lastItem();
                    if (lastItem) {
                        lastItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem();
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    this.setSelection(activeItem);
                    activeItem.click();
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                this.clearSelection();
                this.focus();
                event.stopPropagation();
                break;
            }
        }
    }
    #handleFocusInEvent(event) {
        const { target } = event;
        if (target instanceof HTMLETreeItemElement) {
            this.#setActiveItem(target);
        }
    }
    #handleFocusOutEvent(event) {
        const lostFocusWithin = !this.contains(event.relatedTarget);
        if (lostFocusWithin) {
            this.#setActiveItem(null);
        }
    }
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const element = target.assignedElements()[0];
        this.#group = (element instanceof HTMLETreeItemGroupElement) ? element : null;
    }
};
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETreeElementBase.prototype, "droptarget", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLETreeElementBase.prototype, "name", void 0);
HTMLETreeElementBase = HTMLETreeElementBase_1 = __decorate([
    CustomElement({
        name: "e-tree"
    })
], HTMLETreeElementBase);
var HTMLETreeElement = HTMLETreeElementBase;
//# sourceMappingURL=Tree.js.map