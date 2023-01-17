var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEListItemElement } from "./ListItem";
import { HTMLEListItemGroupElement } from "./ListItemGroup";
import "./ListItem";
import "./ListItemGroup";
export { HTMLEListElement };
var shadowTemplate;
var style;
let HTMLEListElementBase = class HTMLEListElementBase extends HTMLElement {
    get activeItem() {
        return this.querySelector("e-listitem[active]");
    }
    get dropTargetItem() {
        return this.querySelector("e-listitem[droptarget]");
    }
    #onSelection;
    #hasSelectionChanged;
    #walker;
    static {
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
        style = /*css*/ `
            :host {
                display: block;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
        `;
    }
    items() {
        return Array.from(this.querySelectorAll(":is(:scope, :scope > e-listitemgroup) > e-listitem"));
    }
    constructor() {
        super();
        this.#walker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this));
        this.#onSelection = false;
        this.#hasSelectionChanged = false;
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        this.addEventListener("dragend", this.#handleDragEndEvent.bind(this));
        this.addEventListener("dragenter", this.#handleDragEnterEvent.bind(this));
        this.addEventListener("dragover", this.#handleDragOverEvent.bind(this));
        this.addEventListener("dragleave", this.#handleDragLeaveEvent.bind(this));
        this.addEventListener("dragstart", this.#handleDragStartEvent.bind(this));
        this.addEventListener("drop", this.#handleDropEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    connectedCallback() {
        const tabIndex = this.getAttribute("tabindex");
        this.tabIndex = tabIndex === null ? 0 : parseInt(tabIndex);
    }
    beginSelection() {
        this.#onSelection = true;
    }
    endSelection() {
        this.#onSelection = false;
        if (this.#hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            this.#hasSelectionChanged = false;
        }
    }
    selectedItems() {
        const selectedItems = [];
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let item = this.#firstItem();
        while (item !== null) {
            if (item.selected) {
                selectedItems.push(item);
            }
            item = this.#nextItem(item);
        }
        return selectedItems;
    }
    #walkerNodeFilter(node) {
        if (node instanceof HTMLEListItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEListItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }
    #getItemsRange(from, to) {
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
    }
    #setSelection(...items) {
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
    }
    #addToSelection(...items) {
        this.beginSelection();
        items.forEach((item_i) => {
            if (!item_i.selected) {
                item_i.selected = true;
            }
        });
        this.endSelection();
    }
    #removeFromSelection(...items) {
        this.beginSelection();
        const selectedItems = this.selectedItems();
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                item_i.selected = false;
            }
        });
        this.endSelection();
    }
    #clearSelection() {
        this.beginSelection();
        const selectedItems = this.selectedItems();
        selectedItems.forEach((item_i) => {
            if (item_i.selected) {
                item_i.selected = false;
            }
        });
        this.endSelection();
    }
    #setActiveItem(item) {
        const { activeItem, items } = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            item.active = true;
            item.tabIndex = 0;
        }
    }
    #setDropTargetItem(item) {
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
    }
    #firstItem() {
        const walker = this.#walker;
        const { root } = walker;
        walker.currentNode = root;
        return walker.firstChild();
    }
    #lastItem() {
        const walker = this.#walker;
        const { root } = walker;
        walker.currentNode = root;
        return walker.lastChild();
    }
    #previousItem(item) {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousItem = walker.previousNode();
        return previousItem;
    }
    #nextItem(item) {
        const walker = this.#walker;
        walker.currentNode = item;
        const nextItem = walker.nextNode();
        return nextItem;
    }
    #handleContextMenuEvent(event) {
        const { target } = event;
        if (target instanceof HTMLEListItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.#setSelection(target);
            }
            target.focus({ preventScroll: true });
            event.preventDefault();
        }
    }
    #handleDragEndEvent() {
        this.#setDropTargetItem(null);
    }
    #handleDragEnterEvent(event) {
        const { target } = event;
        if (target instanceof HTMLEListItemElement) {
            this.#setDropTargetItem(target);
        }
        event.preventDefault();
    }
    #handleDragOverEvent(event) {
        event.preventDefault();
    }
    #handleDragLeaveEvent(event) {
        const { relatedTarget } = event;
        if (relatedTarget instanceof Element) {
            const parentItem = relatedTarget.closest("e-listitem");
            if (!parentItem) {
                let rootNode = relatedTarget;
                while (!(rootNode instanceof HTMLEListItemElement || rootNode instanceof Document)) {
                    rootNode = rootNode.getRootNode();
                    if (rootNode instanceof ShadowRoot) {
                        rootNode = rootNode.host;
                    }
                }
                if (rootNode instanceof Document) {
                    this.#setDropTargetItem(null);
                }
            }
        }
    }
    #handleDragStartEvent(event) {
        const { target } = event;
        if (target instanceof HTMLEListItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.#setSelection(target);
            }
        }
    }
    #handleDropEvent() {
        this.#setDropTargetItem(null);
    }
    #handleFocusEvent(event) {
        const { relatedTarget } = event;
        const { activeItem } = this;
        if (activeItem && relatedTarget !== activeItem) {
            activeItem.focus();
        }
    }
    #handleFocusInEvent(event) {
        const { target } = event;
        if (target instanceof HTMLEListItemElement) {
            this.#setActiveItem(target);
        }
    }
    #handleKeyDownEvent(event) {
        const { key } = event;
        const { activeItem } = this;
        switch (key) {
            case "a": {
                const { ctrlKey } = event;
                if (ctrlKey) {
                    const walker = this.#walker;
                    const { root } = walker;
                    const firstItem = (walker.currentNode = walker.parentNode() ?? root, walker.firstChild());
                    const lastItem = (walker.currentNode = walker.parentNode() ?? root, walker.lastChild());
                    const range = this.#getItemsRange(firstItem, lastItem);
                    if (range) {
                        this.#setSelection(...range);
                    }
                }
                event.preventDefault();
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
                                this.#removeFromSelection(previousItem) :
                                this.#addToSelection(previousItem);
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
                                this.#removeFromSelection(nextItem) :
                                this.#addToSelection(nextItem);
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
                const { activeItem } = this;
                if (activeItem) {
                    this.#setSelection(activeItem);
                    activeItem.click();
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                this.#clearSelection();
                this.#setActiveItem(null);
                this.focus();
                event.stopPropagation();
                break;
            }
        }
    }
    #handleMouseDownEvent(event) {
        const { target, ctrlKey, shiftKey } = event;
        const selectedItems = this.selectedItems();
        if (target instanceof HTMLEListItemElement) {
            if (!shiftKey && !ctrlKey) {
                this.#setSelection(target);
            }
            else if (ctrlKey) {
                (!target.selected) ?
                    this.#addToSelection(target) :
                    this.#removeFromSelection(target);
                event.stopPropagation();
            }
            else if (shiftKey) {
                const lastSelectedItem = selectedItems[selectedItems.length - 1];
                if (lastSelectedItem) {
                    const range = this.#getItemsRange(lastSelectedItem, target);
                    if (range) {
                        if (selectedItems.includes(target)) {
                            this.#removeFromSelection(...range);
                        }
                        else {
                            this.#addToSelection(...range);
                        }
                    }
                }
                else {
                    this.#setSelection(target);
                }
                event.stopPropagation();
            }
        }
    }
    #handleSelectEvent() {
        if (!this.#onSelection) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
        }
    }
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const assignedItems = target
            .assignedElements()
            .filter(element_i => element_i instanceof HTMLEListItemElement);
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
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