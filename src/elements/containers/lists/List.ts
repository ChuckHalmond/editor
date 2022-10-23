import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEListItemElement } from "./ListItem";
import { HTMLEListItemGroupElement } from "./ListItemGroup";

export { HTMLEListElement };

interface HTMLEListElementConstructor {
    prototype: HTMLEListElement;
    new(): HTMLEListElement;
}

interface HTMLEListElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEListItemElement | null;
    readonly dropTargetItem: HTMLEListItemElement | null;
    name: string;
    droptarget: boolean;
    items(): HTMLEListItemElement[];
    beginSelection(): void;
    endSelection(): void;
    selectedItems(): HTMLEListItemElement[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-list": HTMLEListElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-list"
})
class HTMLEListElementBase extends HTMLElement implements HTMLEListElement {

    readonly shadowRoot!: ShadowRoot;

    get activeItem(): HTMLEListItemElement | null {
        return this.querySelector<HTMLEListItemElement>(
            "e-listitem[active]"
        );
    }

    get dropTargetItem(): HTMLEListItemElement | null {
        return this.querySelector<HTMLEListItemElement>(
            "e-listitem[droptarget]"
        );
    }

    @AttributeProperty({type: String})
    name!: string;
    
    @AttributeProperty({type: Boolean})
    droptarget!: boolean;

    #onSelection: boolean;
    #hasSelectionChanged: boolean;
    #walker: TreeWalker;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`

                    `
                ]
            }),
            element("slot", {
                children: [
                    element("slot")
                ]
            })
        );
        style = /*css*/`
            :host {
                display: block;
            }
            
            :host(:focus) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
        `;
    }

    items(): HTMLEListItemElement[] {
        return Array.from(this.querySelectorAll<HTMLEListItemElement>(
            ":is(:scope, :scope > e-listitemgroup) > e-listitem"
        ));
    }
    
    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.#onSelection = false;
        this.#hasSelectionChanged = false;
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
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

    connectedCallback(): void {
        const tabIndex = this.getAttribute("tabindex");
        this.tabIndex = tabIndex === null ? 0 : parseInt(tabIndex);
    }

    beginSelection(): void {
        this.#onSelection = true;
    }

    endSelection(): void {
        this.#onSelection = false;
        if (this.#hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            this.#hasSelectionChanged = false;
        }
    }

    selectedItems(): HTMLEListItemElement[] {
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

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEListItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEListItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #getItemsRange(from: HTMLEListItemElement, to: HTMLEListItemElement): HTMLEListItemElement[] {
        const items = this.items();
        const fromIndex = items.indexOf(from);
        const toIndex = items.indexOf(to);
        if (fromIndex > -1 && toIndex > -1) {
            if (from == to) {
                return [from];
            }
            return items.slice(
                Math.min(fromIndex, toIndex),
                Math.max(fromIndex, toIndex) + 1
            );
        }
        return [];
    }

    #setSelection(...items: HTMLEListItemElement[]): void {
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

    #addToSelection(...items: HTMLEListItemElement[]): void {
        this.beginSelection();
        items.forEach((item_i) => {
            if (!item_i.selected) {
                item_i.selected = true;
            }
        });
        this.endSelection();
    }

    #removeFromSelection(...items: HTMLEListItemElement[]): void {
        this.beginSelection();
        const selectedItems = this.selectedItems();
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                item_i.selected = false;
            }
        });
        this.endSelection();
    }

    #clearSelection(): void {
        this.beginSelection();
        const selectedItems = this.selectedItems();
        selectedItems.forEach((item_i) => {
            if (item_i.selected) {
                item_i.selected = false;
            }
        });
        this.endSelection();
    }

    #setActiveItem(item: HTMLEListItemElement | null): void {
        const {activeItem, items} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            item.active = true;
            item.tabIndex = 0;
        }
    }

    #setDropTargetItem(item: HTMLEListItemElement | null): void {
        const {dropTargetItem} = this;
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

    #firstItem(): HTMLEListItemElement | null {
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        return <HTMLEListItemElement | null>walker.firstChild();
    }

    #lastItem(): HTMLEListItemElement | null {
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        return <HTMLEListItemElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLEListItemElement): HTMLEListItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousItem = <HTMLEListItemElement | null>walker.previousNode();
        return previousItem;
    }

    #nextItem(item: HTMLEListItemElement): HTMLEListItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const nextItem = <HTMLEListItemElement | null>walker.nextNode();
        return nextItem;
    }

    #handleContextMenuEvent(event: MouseEvent) {
        const {target} = event;
        if (target instanceof HTMLEListItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.#setSelection(target);
            }
            target.focus({preventScroll: true});
            event.preventDefault();
        }
    }

    #handleDragEndEvent(): void {
        this.#setDropTargetItem(null);
    }

    #handleDragEnterEvent(event: DragEvent): void {
        const {target} = event;
        if (target instanceof HTMLEListItemElement) {
            this.#setDropTargetItem(target);
        }
        event.preventDefault();
    }
    
    #handleDragOverEvent(event: DragEvent): void {
        event.preventDefault();
    }

    #handleDragLeaveEvent(event: DragEvent): void {
        const {relatedTarget} = event;
        let rootNode = <Node>relatedTarget;
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

    #handleDragStartEvent(event: DragEvent): void {
        const {target} = event;
        if (target instanceof HTMLEListItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.#setSelection(target);
            }
        }
    }

    #handleDropEvent(): void {
        this.#setDropTargetItem(null);
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {activeItem} = this;
        if (activeItem && relatedTarget !== activeItem) {
            activeItem.focus();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        if (target instanceof HTMLEListItemElement) {
            this.#setActiveItem(target);
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {key} = event;
        const {activeItem} = this;
        switch (key) {
            case "a": {
                const {ctrlKey} = event;
                if (ctrlKey) {
                    const walker = this.#walker;
                    const {root} = walker;
                    const firstItem = <HTMLEListItemElement>(
                        walker.currentNode = walker.parentNode() ?? root, walker.firstChild()
                    );
                    const lastItem = <HTMLEListItemElement>(
                        walker.currentNode = walker.parentNode() ?? root, walker.lastChild()
                    );
                    const range = this.#getItemsRange(
                        firstItem,
                        lastItem
                    );
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
                        previousItem.focus({preventScroll: true});
                        const {shiftKey} = event;
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
                        firstItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (activeItem) {
                    const nextItem = this.#nextItem(activeItem);
                    if (nextItem) {
                        nextItem.focus({preventScroll: true});
                        const {shiftKey} = event;
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
                        lastItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem();
                if (firstItem) {
                    firstItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                if (lastItem) {
                    lastItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                const {activeItem} = this;
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

    #handleMouseDownEvent(event: MouseEvent): void {
        const {target, ctrlKey, shiftKey} = event;
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
                    const range = this.#getItemsRange(
                        lastSelectedItem,
                        target
                    );
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

    #handleSelectEvent(): void {
        if (!this.#onSelection) {
            this.dispatchEvent(new Event("selectionchange", {bubbles: true}));
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedItems = <HTMLEListItemElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEListItemElement
            );
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
    }
}

var HTMLEListElement: HTMLEListElementConstructor = HTMLEListElementBase;