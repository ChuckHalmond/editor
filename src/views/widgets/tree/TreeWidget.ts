import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { treeitemWidget } from "./TreeItemWidget";

export { treeWidget };

interface TreeWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
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

var treeWidget = new (
Widget({
    name: "tree"
})(class TreeWidgetFactoryBase extends WidgetFactory implements TreeWidgetFactory {

    #template: HTMLElement;
    #walker: TreeWalker;
    #onSelection: WeakMap<HTMLElement, boolean>;
    #hasSelectionChanged: WeakMap<HTMLElement, boolean>;

    constructor() {
        super();
        this.#template = element("ul", {
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

    slot(root: HTMLElement, name: string | null): HTMLElement | null {
        return root;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement): void {
        Array.from(slot.childNodes).forEach((item_i, i) => {
            if (item_i instanceof HTMLElement) {
                treeitemWidget.setPosInSet(item_i, i);
                treeitemWidget.setLevel(item_i, 0);
            }
        });
    }

    #getActiveItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(".treeitem.active");
    }

    #getDropTargetItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(".treeitem.droptarget");
    }
    
    #getDropTarget(tree: HTMLElement): boolean {
        const {classList} = tree;
        return classList.contains("droptarget");
    }

    #setDropTarget(tree: HTMLElement, droptarget: boolean): void {
        const {classList} = tree;
        if (droptarget) {
            if (!classList.contains("droptarget")) {
                classList.add("droptarget");
            }
        }
        else {
            classList.remove("droptarget");
        }
    }

    items(menu: HTMLElement): HTMLElement[] {
        return Array.from(menu.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .treeitemgroup) > .treeitem"
        ));
    }

    selectedItems(tree: HTMLElement): HTMLElement[] {
        const selectedItems = [];
        const walker = this.#walker;
        walker.currentNode = tree;
        let item = this.#firstItem(tree);
        while (item !== null) {
            const selected = treeitemWidget.getSelected(item);
            if (selected) {
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
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("treeitem") && !treeitemWidget.getDisabled(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("treeitemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    }

    #getItemsRange(from: HTMLElement, to: HTMLElement): HTMLElement[] {
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

    #setSelection(tree: HTMLElement, ...items: HTMLElement[]): void {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        selectedItems.forEach((item_i) => {
            if (!items.includes(item_i)) {
                treeitemWidget.setSelected(item_i, false);
            }
        });
        items.forEach((item_i) => {
            const selected = treeitemWidget.getSelected(item_i);
            if (tree.contains(item_i) && !selected) {
                treeitemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(tree);
    }

    #addToSelection(tree: HTMLElement, ...items: HTMLElement[]): void {
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (!treeitemWidget.getSelected(item_i)) {
                treeitemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(tree);
    }

    #removeFromSelection(tree: HTMLElement, ...items: HTMLElement[]): void {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                treeitemWidget.setSelected(item_i, false);
            }
        });
        this.endSelection(tree);
    }

    #clearSelection(tree: HTMLElement): void {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        selectedItems.forEach((item_i) => {
            treeitemWidget.setSelected(item_i, false);
        });
        this.endSelection(tree);
    }

    #setActiveItem(tree: HTMLElement, item: HTMLElement | null): void {
        const activeItem = this.#getActiveItem(tree);
        if (activeItem !== null && activeItem !== item) {
            treeitemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            treeitemWidget.setActive(item, true);
            item.tabIndex = 0;
        }
    }
    
    #setDropTargetItem(tree: HTMLElement, item: HTMLElement | null): void {
        const dropTargetItem = this.#getDropTargetItem(tree);
        if (dropTargetItem !== null && dropTargetItem !== item) {
            treeitemWidget.setDropTarget(dropTargetItem, false);
        }
        if (item !== null) {
            this.#setDropTarget(tree, true);
            treeitemWidget.setDropTarget(item, false);
        }
        else {
            this.#setDropTarget(tree, false);
        }
    }

    #firstItem(tree: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = tree;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(tree: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = tree;
        return <HTMLElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousSibling = <HTMLElement | null>walker.previousSibling();
        return previousSibling ?
            this.#deepestItem(previousSibling) :
            <HTMLElement | null>walker.parentNode();
    }

    #nextItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const type = treeitemWidget.getType(item);
        const expanded = treeitemWidget.getExpanded(item);
        return <HTMLElement | null>(
            type === "leaf" ?
                walker.nextNode() :
                expanded ?
                    walker.nextNode() :
                    walker.nextSibling() ??
                    (walker.parentNode(), walker.nextSibling())
        );
    }

    #deepestItem(item: HTMLElement): HTMLElement {
        const expanded = treeitemWidget.getExpanded(item);
        if (expanded) {
            const walker = this.#walker;
            const lastItem = <HTMLElement>walker.lastChild();
            if (lastItem) {
                return this.#deepestItem(lastItem);
            }
        }
        return item;
    }

    #handleClickEvent(event: MouseEvent): void {
        const {currentTarget, target, ctrlKey, shiftKey} = event;
        const targetTree = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".treeitem");
        const selectedItems = this.selectedItems(targetTree);
        if (targetItem) {
            if (!shiftKey && !ctrlKey) {
                this.#setSelection(targetTree, targetItem);
            }
            else if (ctrlKey) {
                const selected = treeitemWidget.getSelected(targetItem);
                if (selected) {
                    targetItem.blur();
                }
                (!selected) ?
                    this.#addToSelection(targetTree, targetItem) :
                    this.#removeFromSelection(targetTree, targetItem);
                event.stopPropagation();
            }
            else if (shiftKey) {
                const lastSelectedItem = selectedItems[selectedItems.length - 1];
                if (lastSelectedItem) {
                    const range = this.#getItemsRange(
                        lastSelectedItem,
                        targetItem
                    );
                    if (range) {
                        if (selectedItems.includes(targetItem)) {
                            this.#removeFromSelection(targetTree, ...range);
                        }
                        else {
                            this.#addToSelection(targetTree, ...range);
                        }
                    }
                }
                else {
                    this.#setSelection(targetTree, targetItem);
                }
                event.stopPropagation();
            }
        }
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        const {currentTarget, target} = event;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".treeitem");
        const targetTree = <HTMLElement>currentTarget;
        if (targetItem) {
            const selectedItems = this.selectedItems(targetTree);
            if (!selectedItems.includes(targetItem)) {
                this.#setSelection(targetTree, targetItem);
            }
            event.preventDefault();
        }
    }

    #handleDragEndEvent(event: DragEvent): void {
        const {currentTarget} = event;
        const targetTree = <HTMLElement>currentTarget;
        this.#setDropTargetItem(targetTree, null);
    }

    #handleDragEnterEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".treeitem");
        const targetTree = <HTMLElement>currentTarget;
        if (targetItem) {
            const type = treeitemWidget.getType(targetItem);
            if (type == "parent") {
                treeitemWidget.toggle(targetItem, true);
            }
            this.#setDropTargetItem(targetTree, targetItem);
        }
        event.preventDefault();
    }

    #handleDragOverEvent(event: DragEvent): void {
        event.preventDefault();
    }

    #handleDragLeaveEvent(event: DragEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetTree = <HTMLElement>currentTarget;
        if (relatedTarget) {
            const relatedTargetRoot = (<Node>relatedTarget).getRootNode();
            const relatedTargetHost =
                relatedTargetRoot instanceof ShadowRoot ?
                relatedTargetRoot.host :
                relatedTarget;
            if (!targetTree.contains(<Node>relatedTargetHost)) {
                this.#setDropTargetItem(targetTree, null);
            }
        }
    }

    #handleDragStartEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const targetTree = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("treeitem")) {
            const selectedItems = this.selectedItems(targetTree);
            if (!selectedItems.includes(target)) {
                this.#setSelection(targetTree, target);
            }
        }
    }

    #handleDropEvent(event: DragEvent): void {
        const {currentTarget} = event;
        const targetTree = <HTMLElement>currentTarget;
        this.#setDropTargetItem(targetTree, null);
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {currentTarget, key} = event;
        const targetTree = <HTMLElement>currentTarget;
        const activeItem = this.#getActiveItem(targetTree);
        switch (key) {
            case "a": {
                const {ctrlKey} = event;
                if (ctrlKey) {
                    if (activeItem) {
                        const walker = this.#walker;
                        walker.currentNode = activeItem;
                        const firstItem = <HTMLElement>(
                            walker.currentNode = walker.parentNode() ?? targetTree, walker.firstChild()
                        );
                        const lastItem = <HTMLElement>(
                            walker.currentNode = walker.parentNode() ?? targetTree, walker.lastChild()
                        );
                        if (firstItem && lastItem) {
                            const range = this.#getItemsRange(
                                firstItem,
                                this.#deepestItem(lastItem)
                            );
                            if (range) {
                                this.#setSelection(targetTree, ...range);
                            }
                        }
                    }
                }
                event.preventDefault();
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const expanded = treeitemWidget.getExpanded(activeItem);
                    if (expanded) {
                        treeitemWidget.toggle(activeItem);
                    }
                    else {
                        const walker = this.#walker;
                        const parentItem = <HTMLElement>walker.parentNode();
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
                    const expanded = treeitemWidget.getExpanded(activeItem);
                    if (!expanded) {
                        treeitemWidget.toggle(activeItem);
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
                            const selected = treeitemWidget.getSelected(previousItem);
                            selected ?
                                this.#removeFromSelection(targetTree, previousItem) :
                                this.#addToSelection(targetTree, previousItem);
                        }
                    }
                }
                else {
                    const firstItem = this.#firstItem(targetTree);
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
                            const selected = treeitemWidget.getSelected(nextItem);
                            selected ?
                                this.#removeFromSelection(targetTree, nextItem) :
                                this.#addToSelection(targetTree, nextItem);
                        }
                    }
                }
                else {
                    const lastItem = this.#lastItem(targetTree);
                    if (lastItem) {
                        lastItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem(targetTree);
                if (firstItem) {
                    firstItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem(targetTree);
                if (lastItem) {
                    lastItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    this.#setSelection(targetTree, activeItem);
                    activeItem.click();
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                this.#clearSelection(targetTree);
                this.#setActiveItem(targetTree, null);
                targetTree.focus();
                event.stopPropagation();
                break;
            }
        }
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetTree = <HTMLElement>currentTarget;
        const activeItem = this.#getActiveItem(targetTree);
        if (activeItem && relatedTarget !== activeItem) {
            activeItem.focus();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {currentTarget, target} = event;
        const targetTree = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("treeitem")) {
            this.#setActiveItem(targetTree, target);
            targetTree.tabIndex = -1;
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetTree = <HTMLElement>currentTarget;
        const lostFocusWithin = !targetTree.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            targetTree.tabIndex = 0;
        }
    }

    #handleSelectEvent(event: Event): void {
        const {target} = event;
        const targetTree = <HTMLElement>target;
        if (target instanceof HTMLElement && target.classList.contains("treeitem")) {
            if (this.#onSelection.get(targetTree)) {
                this.#hasSelectionChanged.set(target, true);
            }
            else {
                targetTree.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            }
        }
    }
}));