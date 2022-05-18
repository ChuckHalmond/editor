import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLETreeItemElement } from "./TreeItem";
import { HTMLETreeItemCollection } from "./TreeItemCOllection";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";

export { HTMLETreeElement };

interface HTMLETreeElementConstructor {
    readonly prototype: HTMLETreeElement;
    new(): HTMLETreeElement;
}

interface HTMLETreeElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLETreeItemCollection;
    readonly activeItem: HTMLETreeItemElement | null;
    readonly dropTargetItem: HTMLETreeItemElement | null;
    droptarget: boolean;
    name: string;
    selectedItems(): HTMLETreeItemElement[];
    beginSelection(): void;
    endSelection(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-tree"
})
class HTMLETreeElementBase extends HTMLElement implements HTMLETreeElement {

    readonly shadowRoot!: ShadowRoot;
    readonly items: HTMLETreeItemCollection;

    get activeIndex(): number {
        return this.#activeIndex;
    }

    get activeItem(): HTMLETreeItemElement | null {
        return this.items.item(this.#activeIndex) ?? null;
    }

    get dropTargetItem(): HTMLETreeItemElement | null {
        return this.items.item(this.#dropTargetIndex) ?? null;
    }
    
    @AttributeProperty({type: Boolean})
    droptarget!: boolean;

    @AttributeProperty({type: String})
    name!: string;

    #activeIndex: number;
    #dropTargetIndex: number;
    #onSelection: boolean;
    #hasSelectionChanged: boolean;
    #walker: TreeWalker;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: block;
                        }

                        :host([droptarget]) {
                            outline: 1px solid black;
                            outline-offset: -1px;
                        }
                    `
                }
            }),
            element("slot")
        );
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
        this.#activeIndex = -1;
        this.#dropTargetIndex = -1;
        this.#onSelection = false;
        this.#hasSelectionChanged = false;
        this.items = new HTMLETreeItemCollection(this);
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this), true);
        this.addEventListener("dragend", this.#handleDragEndEvent.bind(this));
        this.addEventListener("dragenter", this.#handleDragEnterEvent.bind(this));
        this.addEventListener("dragleave", this.#handleDragLeaveEvent.bind(this));
        this.addEventListener("dragover", this.#handleDragOverEvent.bind(this));
        this.addEventListener("dragstart", this.#handleDragStartEvent.bind(this));
        this.addEventListener("drop", this.#handleDropEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }

    selectedItems(): HTMLETreeItemElement[] {
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

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLETreeItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLETreeItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #getItemsRange(from: HTMLETreeItemElement, to: HTMLETreeItemElement): HTMLETreeItemElement[] {
        if (from == to) {
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
        return [];
    }

    #setSelection(...items: HTMLETreeItemElement[]): void {
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
    }

    #addToSelection(...items: HTMLETreeItemElement[]): void {
        this.beginSelection();
        items.forEach((item_i) => {
            if (!item_i.selected) {
                item_i.selected = true;
            }
        });
        this.endSelection();
    }

    #removeFromSelection(...items: HTMLETreeItemElement[]): void {
        const selectedItems = this.selectedItems();
        this.beginSelection();
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                item_i.selected = false;
            }
        });
        this.endSelection();
    }

    #clearSelection(): void {
        const selectedItems = this.selectedItems();
        this.beginSelection();
        selectedItems.forEach((item_i) => {
            item_i.selected = false;
        });
        this.endSelection();
    }

    #setActiveItem(item: HTMLETreeItemElement): void {
        const {activeItem, items} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
            activeItem.tabIndex = -1;
        }
        const walker = this.#walker;
        walker.currentNode = item;
        item.active = true;
        item.tabIndex = 0;
        this.#activeIndex = Array.from(items.values()).indexOf(item);
    }
    
    #setDropTargetItem(item: HTMLETreeItemElement | null): void {
        const {dropTargetItem, items} = this;
        if (dropTargetItem !== null && dropTargetItem !== item) {
            dropTargetItem.droptarget = false;
        }
        if (item !== null) {
            this.droptarget = true;
            item.droptarget = true;
            this.#dropTargetIndex = Array.from(items.values()).indexOf(item);
        }
        else {
            this.droptarget = false;
            this.#dropTargetIndex = -1;
        }
    }

    #firstItem(): HTMLETreeItemElement | null {
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        return <HTMLETreeItemElement | null>walker.firstChild();
    }

    #lastItem(): HTMLETreeItemElement | null {
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        return <HTMLETreeItemElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLETreeItemElement): HTMLETreeItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousSibling = <HTMLETreeItemElement | null>walker.previousSibling();
        return previousSibling ?
            this.#deepestItem(previousSibling) :
            <HTMLETreeItemElement | null>walker.parentNode();
    }

    #nextItem(item: HTMLETreeItemElement): HTMLETreeItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const {expanded} = item;
        return <HTMLETreeItemElement | null>(
            expanded ?
            walker.nextNode() :
            walker.nextSibling() ??
            (walker.parentNode(), walker.nextSibling())
        );
    }

    #deepestItem(item: HTMLETreeItemElement): HTMLETreeItemElement {
        if (item.expanded) {
            const walker = this.#walker;
            const lastItem = <HTMLETreeItemElement>walker.lastChild();
            if (lastItem) {
                return this.#deepestItem(lastItem);
            }
        }
        return item;
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target, ctrlKey, shiftKey} = event;
        const selectedItems = this.selectedItems();
        if (target instanceof HTMLETreeItemElement) {
            if (!shiftKey && !ctrlKey) {
                this.#setSelection(target);
            }
            else if (ctrlKey) {
                const {selected} = target;
                if (selected) {
                    target.blur();
                }
                (!selected) ?
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

    #handleContextMenuEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLETreeItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.#setSelection(target);
            }
            event.preventDefault();
        }
    }

    #handleDragEndEvent(): void {
        this.#setDropTargetItem(null);
    }

    #handleDragEnterEvent(event: DragEvent): void {
        const {target} = event;
        if (target instanceof HTMLETreeItemElement) {
            const {type} = target;
            if (type == "parent") {
                target.toggle(true);
            }
            this.#setDropTargetItem(target);
        }
        event.preventDefault();
    }

    #handleDragOverEvent(event: DragEvent): void {
        event.preventDefault();
    }

    #handleDragLeaveEvent(event: DragEvent): void {
        const {relatedTarget} = event;
        if (relatedTarget) {
            const relatedTargetRoot = (<Node>relatedTarget).getRootNode();
            const relatedTargetHost =
                relatedTargetRoot instanceof ShadowRoot ?
                relatedTargetRoot.host :
                relatedTarget;
            if (!this.contains(<Node>relatedTargetHost)) {
                this.#setDropTargetItem(null);
            }
        }
    }

    #handleDragStartEvent(event: DragEvent): void {
        const {target} = event;
        if (target instanceof HTMLETreeItemElement) {
            const selectedItems = this.selectedItems();
            if (!selectedItems.includes(target)) {
                this.#setSelection(target);
            }
        }
    }

    #handleDropEvent(): void {
        this.#setDropTargetItem(null);
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {activeItem} = this;
        switch (key) {
            case "a": {
                const {ctrlKey} = event;
                if (ctrlKey) {
                    if (activeItem) {
                        const walker = this.#walker;
                        const {root} = walker;
                        walker.currentNode = activeItem;
                        const firstItem = <HTMLETreeItemElement>(
                            walker.currentNode = walker.parentNode() ?? root, walker.firstChild()
                        );
                        const lastItem = <HTMLETreeItemElement>(
                            walker.currentNode = walker.parentNode() ?? root, walker.lastChild()
                        );
                        if (firstItem && lastItem) {
                            const range = this.#getItemsRange(
                                firstItem,
                                this.#deepestItem(lastItem)
                            );
                            if (range) {
                                this.#setSelection(...range);
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
                        const walker = this.#walker;
                        const parentItem = <HTMLETreeItemElement>walker.parentNode();
                        if (parentItem) {
                            parentItem.focus({preventScroll: true});
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
                if (activeItem) {
                    this.#setSelection(activeItem);
                    activeItem.click();
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                this.#clearSelection();
                this.focus();
                event.stopPropagation();
                break;
            }
        }
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
        if (target instanceof HTMLETreeItemElement) {
            this.#setActiveItem(target);
        }
    }

    #handleSelectEvent(): void {
        if (this.#onSelection) {
            this.#hasSelectionChanged = true;
        }
        else {
            this.dispatchEvent(new Event("selectionchange", {bubbles: true}));
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedItems = <HTMLETreeItemElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLETreeItemElement
            );
        assignedItems.forEach((item_i, i) => {
            item_i.posinset = i;
        });
    }
}

var HTMLETreeElement: HTMLETreeElementConstructor = HTMLETreeElementBase;