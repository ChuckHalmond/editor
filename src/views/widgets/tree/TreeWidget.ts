import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { treeItemWidget } from "./TreeItemWidget";

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

    create(init?: {
        multisectable?: boolean;
    }): HTMLElement {
        const tree = <HTMLElement>this.#template.cloneNode(true);
        tree.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        tree.addEventListener("dragend", this.#handleDragEndEvent.bind(this));
        tree.addEventListener("dragenter", this.#handleDragEnterEvent.bind(this));
        tree.addEventListener("dragleave", this.#handleDragLeaveEvent.bind(this));
        tree.addEventListener("dragover", this.#handleDragOverEvent.bind(this));
        tree.addEventListener("drop", this.#handleDropEvent.bind(this));
        tree.addEventListener("focus", this.#handleFocusEvent.bind(this));
        tree.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        tree.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        tree.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        tree.addEventListener("select", this.#handleSelectEvent.bind(this));
        this.#onSelection.set(tree, false);
        this.#hasSelectionChanged.set(tree, false);
        if (init !== void 0) {
            const {multisectable} = init;
            if (multisectable !== void 0) {
                this.setMultiSelectable(tree, multisectable);
            }
        }
        return tree;
    }

    slot(tree: HTMLElement) {
        return tree;
    }

    slottedCallback(tree: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((child_i, i) => {
            if (child_i instanceof HTMLElement && child_i.classList.contains("treeitem")) {
                treeItemWidget.setPosInSet(child_i, i);
                treeItemWidget.setLevel(child_i, 0);
            }
        });
    }

    items(tree: HTMLElement): HTMLElement[] {
        return Array.from(tree.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .treeitemgroup) > .treeitem"
        ));
    }

    selectedItems(tree: HTMLElement): HTMLElement[] {
        const selectedItems = [];
        const walker = this.#walker;
        walker.currentNode = tree;
        let item = this.#firstItem(tree);
        while (item !== null) {
            const selected = treeItemWidget.getSelected(item);
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

    setMultiSelectable(tree: HTMLElement, value: boolean): void {
        tree.setAttribute("aria-multiselectable", value.toString());
    }

    getMultiSelectable(tree: HTMLElement): boolean {
        return JSON.parse(tree.getAttribute("aria-multiselectable") ?? false.toString());
    }

    #getActiveItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(".treeitem.active");
    }

    #getDropTargetItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(".treeitem.droptarget");
    }

    #setDropTargetItem(tree: HTMLElement, item: HTMLElement | null): void {
        const {classList} = tree;
        const dropTargetItem = this.#getDropTargetItem(tree);
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
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("treeitem") && !treeItemWidget.getDisabled(node)) {
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
            let nextItem = this.#nextItem(from);
            while (nextItem && nextItem !== to) {
                range.push(nextItem);
                nextItem = this.#nextItem(nextItem);
            }
            range.push(to);
            return range;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            const range = [from];
            let previousItem = this.#previousItem(from);
            while (previousItem && previousItem !== to) {
                range.push(previousItem);
                previousItem = this.#previousItem(previousItem);
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
    }

    #addToSelection(tree: HTMLElement, ...items: HTMLElement[]): void {
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (!treeItemWidget.getSelected(item_i)) {
                treeItemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(tree);
    }

    #removeFromSelection(tree: HTMLElement, ...items: HTMLElement[]): void {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                treeItemWidget.setSelected(item_i, false);
            }
        });
        this.endSelection(tree);
    }

    #clearSelection(tree: HTMLElement): void {
        const selectedItems = this.selectedItems(tree);
        this.beginSelection(tree);
        selectedItems.forEach((item_i) => {
            treeItemWidget.setSelected(item_i, false);
        });
        this.endSelection(tree);
    }

    #setActiveItem(tree: HTMLElement, item: HTMLElement | null): void {
        const activeItem = this.#getActiveItem(tree);
        if (activeItem !== null && activeItem !== item) {
            treeItemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            treeItemWidget.setActive(item, true);
            item.tabIndex = 0;
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
        const type = treeItemWidget.getType(item);
        const expanded = treeItemWidget.getExpanded(item);
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
        const expanded = treeItemWidget.getExpanded(item);
        if (expanded) {
            const walker = this.#walker;
            const lastItem = <HTMLElement>walker.lastChild();
            if (lastItem) {
                return this.#deepestItem(lastItem);
            }
        }
        return item;
    }

    #handleMouseDownEvent(event: MouseEvent): void {
        const {currentTarget, target, ctrlKey, shiftKey, button} = event;
        const targetTree = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".treeitem");
        if (targetItem) {
            const selected = treeItemWidget.getSelected(targetItem);
            switch (button) {
                case 0: {
                    if (!shiftKey && !ctrlKey) {
                        this.#setSelection(targetTree, targetItem);
                    }
                    else if (ctrlKey) {
                        if (selected) {
                            targetItem.blur();
                            this.#removeFromSelection(targetTree, targetItem);
                        }
                        else {
                            this.#addToSelection(targetTree, targetItem);
                        }
                        event.stopPropagation();
                    }
                    else if (shiftKey) {
                        const activeItem = this.#getActiveItem(targetTree);
                        if (activeItem) {
                            const range = this.#getItemsRange(
                                activeItem,
                                targetItem
                            );
                            if (range) {
                                this.#setSelection(targetTree, ...range);
                            }
                        }
                        event.stopPropagation();
                    }
                    break;
                }
                case 2: {
                    if (!selected) {
                        this.#setSelection(targetTree, targetItem);
                    }
                    break;
                }
            }
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
            const type = treeItemWidget.getType(targetItem);
            if (type == "parent") {
                treeItemWidget.toggle(targetItem, true);
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
                    const expanded = treeItemWidget.getExpanded(activeItem);
                    if (expanded) {
                        treeItemWidget.toggle(activeItem);
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
                    const previousItem = this.#previousItem(activeItem);
                    if (previousItem) {
                        previousItem.focus({preventScroll: true});
                        const {shiftKey} = event;
                        if (shiftKey) {
                            const selected = treeItemWidget.getSelected(previousItem);
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
                            const selected = treeItemWidget.getSelected(nextItem);
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
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".treeitem");
        const targetTree = <HTMLElement>currentTarget;
        if (targetItem) {
            this.#setActiveItem(targetTree, targetItem);
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