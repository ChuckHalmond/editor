/*import { Widget } from "../../../elements/Element";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { WidgetFactory } from "../Widget";

export { HTMLETreeElement };

interface TreeWidgetFactory extends WidgetFactory {
    create(properties?: {
        contextual?: boolean;
    }): HTMLElement;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
}

declare global {
    interface WidgetNameMap {
        "tree": TreeWidgetFactory,
    }
}

var shadowTemplate: HTMLTemplateElement;

var treeWidget = new (
Widget({
    name: "tree"
})(class TreeWidgetFactoryBase extends WidgetFactory implements TreeWidgetFactory {

    #template: HTMLElement;
    #walker: TreeWalker;

    #getActiveItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(
            "e-treeitem[active]"
        );
    }

    #getDropTargetItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(
            "e-treeitem[droptarget]"
        );
    }
    
    #getDropTarget(tree: HTMLElement): boolean {
        const {classList} = tree;
        return classList.contains("droptarget");
    }

    #setDropTarget(tree: HTMLElement, droptarget: boolean): void {
        const {classList} = tree;
        if (droptarget) {
            if (!this.#getDropTarget(tree)) {
                classList.add("droptarget");
            }
        }
        else {
            classList.remove("droptarget");
        }
    }

    #onSelection: WeakMap<HTMLElement, boolean>;
    #hasSelectionChanged: WeakMap<HTMLElement, boolean>;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
    }

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "tree",
                role: "tree",
                tabindex: 0
            }
        });
        this.#onSelection = new WeakMap();
        this.#hasSelectionChanged = new WeakMap();
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
    }

    create(): HTMLElement {
        const tree = <HTMLElement>this.#template.cloneNode(true);
        tree.addEventListener("click", this.#handleClickEvent.bind(this));
        tree.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this), true);
        tree.addEventListener("dragend", this.#handleDragEndEvent.bind(this));
        tree.addEventListener("dragenter", this.#handleDragEnterEvent.bind(this));
        tree.addEventListener("dragleave", this.#handleDragLeaveEvent.bind(this));
        tree.addEventListener("dragover", this.#handleDragOverEvent.bind(this));
        tree.addEventListener("dragstart", this.#handleDragStartEvent.bind(this));
        tree.addEventListener("drop", this.#handleDropEvent.bind(this));
        tree.addEventListener("focus", this.#handleFocusEvent.bind(this));
        tree.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        tree.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        tree.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        tree.addEventListener("select", this.#handleSelectEvent.bind(this));
        this.#onSelection.set(tree, false);
        this.#hasSelectionChanged.set(tree, false);
        return tree;
    }

    selectedItems(tree: HTMLElement): HTMLETreeItemElement[] {
        const selectedItems = [];
        const walker = this.#walker;
        walker.currentNode = tree;
        let item = this.#firstItem();
        while (item !== null) {
            if (item.selected) {
                selectedItems.push(item);
            }
            item = this.#nextItem(item);
        }
        return selectedItems;
    }

    beginSelection(tree: HTMLElement): void {
        this.#onSelection.set(tree, true);
    }

    endSelection(tree: HTMLElement): void {
        this.#onSelection.set(tree, false);
        if (this.#hasSelectionChanged.get(tree)) {
            tree.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            this.#hasSelectionChanged.set(tree, false);
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

    #getItemsRange(from: HTMLElement, to: HTMLElement): HTMLETreeItemElement[] {
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

    #setSelection(tree: HTMLElement, ...items: HTMLETreeItemElement[]): void {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        selectedItems.forEach((selectedItem_i) => {
            if (!items.includes(selectedItem_i)) {
                //TODO: widget setSelected()
                selectedItem_i.selected = false;
            }
        });
        items.forEach((item_i) => {
            if (tree.contains(item_i) && !item_i.selected) {
                item_i.selected = true;
            }
        });
        this.endSelection(tree);
    }

    #addToSelection(tree: HTMLElement, ...items: HTMLETreeItemElement[]): void {
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (!item_i.selected) {
                item_i.selected = true;
            }
        });
        this.endSelection(tree);
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

    #setActiveItem(item: HTMLETreeItemElement | null): void {
        const {activeItem} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            const walker = this.#walker;
            walker.currentNode = item;
            item.active = true;
            item.tabIndex = 0;
        }
    }
    
    #setDropTargetItem(item: HTMLETreeItemElement | null): void {
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
        const {type, expanded} = item;
        return <HTMLETreeItemElement | null>(
            type === "leaf" ?
                walker.nextNode() :
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
                this.#setActiveItem(null);
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
            this.tabIndex = -1;
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.tabIndex = 0;
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
            item_i.level = 0;
        });
    }
}

var HTMLETreeElement: HTMLETreeElementConstructor = HTMLETreeElementBase;*/