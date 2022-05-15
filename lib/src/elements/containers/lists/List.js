var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEListItemElement } from "./ListItem";
import { HTMLEListItemGroupElement } from "./ListItemGroup";
export { HTMLEListElement };
let HTMLEListElementBase = class HTMLEListElementBase extends HTMLElement {
    name;
    droptarget;
    #droptarget;
    #activeIndex;
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
        }), HTML("slot"));
        this.#activeIndex = -1;
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
    }
    get group() {
        const { children } = this;
        return Array.from(children).find(child_i => child_i instanceof HTMLEListItemGroupElement) ?? null;
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeItem() {
        const { group } = this;
        const items = group?.items ?? [];
        return items[this.#activeIndex] ?? null;
    }
    selectedItems() {
        const { group } = this;
        if (group) {
            const { items } = group;
            return items.filter(item_i => item_i.selected);
        }
        return [];
    }
    getItemsRange(from, to) {
        const { group } = this;
        if (group) {
            const { items } = group;
            const fromIndex = items.indexOf(from);
            const toIndex = items.indexOf(to);
            if (fromIndex > -1 && toIndex > -1) {
                if (from === to) {
                    return [from];
                }
                return items.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
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
    #setActiveItem(item) {
        const { activeItem, group } = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null) {
            item.active = true;
            const items = group?.items ?? [];
            this.#activeIndex = items.indexOf(item);
        }
        else {
            this.#activeIndex = -1;
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
        if (target instanceof HTMLEListItemElement) {
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
        if (target instanceof HTMLEListItemElement) {
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
        if (target instanceof HTMLEListItemElement) {
            this.#setDropTarget(target);
        }
        else {
            this.#setDropTarget(this);
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
        if (target instanceof HTMLEListItemElement) {
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
        const { activeIndex, group } = this;
        const items = group?.items ?? [];
        switch (key) {
            case "a": {
                const { ctrlKey } = event;
                if (ctrlKey) {
                    const firstItem = items[0];
                    const lastItem = items[items.length - 1];
                    const range = this.getItemsRange(firstItem, lastItem);
                    if (range) {
                        this.setSelection(...range);
                    }
                }
                event.preventDefault();
                break;
            }
            case "ArrowUp": {
                if (activeIndex > 0) {
                    const previousItem = items[activeIndex - 1];
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
                    const firstItem = items[0];
                    if (firstItem) {
                        firstItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (activeIndex < items.length - 1) {
                    const nextItem = items[activeIndex + 1];
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
                    const lastItem = items[items.length - 1];
                    if (lastItem) {
                        lastItem.focus({ preventScroll: true });
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = items[0];
                if (firstItem) {
                    firstItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = items[items.length - 1];
                if (lastItem) {
                    lastItem.focus({ preventScroll: true });
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                const { activeItem } = this;
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
        if (target instanceof HTMLEListItemElement) {
            this.#setActiveItem(target);
        }
    }
    #handleFocusOutEvent(event) {
        const lostFocusWithin = !this.contains(event.relatedTarget);
        if (lostFocusWithin) {
            this.#setActiveItem(null);
        }
    }
};
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