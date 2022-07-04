import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { listitemWidget } from "./ListItemWidget";

interface ListWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
    items(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    selectedItems(list: HTMLElement): HTMLElement[];
}

declare global {
    interface WidgetNameMap {
        "list": ListWidgetFactory,
    }
}

var listWidget = new (
Widget({
    name: "list"
})(class ListWidgetFactoryBase extends WidgetFactory implements ListWidgetFactory {
    #template: HTMLElement;
    #walker: TreeWalker;
    #onSelection: WeakMap<HTMLElement, boolean>;
    #hasSelectionChanged: WeakMap<HTMLElement, boolean>;

    constructor() {
        super();
        this.#template = element("ul", {
            attributes: {
                class: "list",
                role: "list",
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
        const list = <HTMLElement>this.#template.cloneNode(true);
        if (init !== void 0) {
            const {multisectable} = init;
            if (multisectable !== void 0) {
                this.setMultiSelectable(list, multisectable);
            }
        }
        list.addEventListener("dragend", this.#handleDragEndEvent.bind(this));
        list.addEventListener("dragenter", this.#handleDragEnterEvent.bind(this));
        list.addEventListener("dragleave", this.#handleDragLeaveEvent.bind(this));
        list.addEventListener("dragover", this.#handleDragOverEvent.bind(this));
        list.addEventListener("dragstart", this.#handleDragStartEvent.bind(this));
        list.addEventListener("drop", this.#handleDropEvent.bind(this));
        list.addEventListener("focus", this.#handleFocusEvent.bind(this));
        list.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        list.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        list.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        list.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        list.addEventListener("select", this.#handleSelectEvent.bind(this));
        this.#onSelection.set(list, false);
        this.#hasSelectionChanged.set(list, false);
        return list;
    }

    slot(root: HTMLElement) {
        return root;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement) {
        Array.from(slot.childNodes).forEach((item_i, i) => {
            if (item_i instanceof HTMLElement) {
                listitemWidget.setPosInSet(item_i, i);
            }
        });
    }

    setMultiSelectable(tree: HTMLElement, value: boolean): void {
        tree.setAttribute("aria-multiselectable", value.toString());
    }

    getMultiSelectable(tree: HTMLElement): boolean {
        return JSON.parse(tree.getAttribute("aria-multiselectable") ?? false.toString());
    }

    #getActiveItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(".listitem.active");
    }

    #getDropTargetItem(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(".listitem.droptarget");
    }

    items(list: HTMLElement): HTMLElement[] {
        return Array.from(list.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .listitemgroup) > .listitem"
        ));
    }

    selectedItems(list: HTMLElement): HTMLElement[] {
        const selectedItems = [];
        const walker = this.#walker;
        walker.currentNode = list;
        let item = this.#firstItem(list);
        while (item !== null) {
            const selected = listitemWidget.getSelected(item);
            if (selected) {
                selectedItems.push(item);
            }
            item = this.#nextItem(item);
        }
        return selectedItems;
    }

    beginSelection(list: HTMLElement): void {
        this.#onSelection.set(list, true);
    }

    endSelection(list: HTMLElement): void {
        this.#onSelection.set(list, false);
        if (this.#hasSelectionChanged.get(list)) {
            list.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            this.#hasSelectionChanged.set(list, false);
        }
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("listitem") && !listitemWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("listitemgroup")) {
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

    #setSelection(list: HTMLElement, ...items: HTMLElement[]): void {
        const selectedItems = this.selectedItems(list);
        this.beginSelection(list);
        selectedItems.forEach((item_i) => {
            if (!items.includes(item_i)) {
                listitemWidget.setSelected(item_i, false);
            }
        });
        items.forEach((item_i) => {
            const selected = listitemWidget.getSelected(item_i);
            if (list.contains(item_i) && !selected) {
                listitemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(list);
    }

    #addToSelection(list: HTMLElement, ...items: HTMLElement[]): void {
        this.beginSelection(list);
        items.forEach((item_i) => {
            if (!listitemWidget.getSelected(item_i)) {
                listitemWidget.setSelected(item_i, true);
            }
        });
        this.endSelection(list);
    }

    #removeFromSelection(list: HTMLElement, ...items: HTMLElement[]): void {
        const selectedItems = this.selectedItems(list);
        this.beginSelection(list);
        items.forEach((item_i) => {
            if (selectedItems.includes(item_i)) {
                listitemWidget.setSelected(item_i, false);
            }
        });
        this.endSelection(list);
    }

    #clearSelection(list: HTMLElement): void {
        const selectedItems = this.selectedItems(list);
        this.beginSelection(list);
        selectedItems.forEach((item_i) => {
            listitemWidget.setSelected(item_i, false);
        });
        this.endSelection(list);
    }

    #setActiveItem(list: HTMLElement, item: HTMLElement | null): void {
        const activeItem = this.#getActiveItem(list);
        if (activeItem !== null && activeItem !== item) {
            listitemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            listitemWidget.setActive(item, true);
            item.tabIndex = 0;
        }
    }
    
    #setDropTargetItem(list: HTMLElement, item: HTMLElement | null): void {
        const {classList} = list;
        const dropTargetItem = this.#getDropTargetItem(list);
        if (dropTargetItem !== null && dropTargetItem !== item) {
            listitemWidget.setDropTarget(dropTargetItem, false);
        }
        if (item !== null) {
            listitemWidget.setDropTarget(item, false);
            classList.add("droptarget");
        }
        else {
            classList.remove("droptarget");
        }
    }

    #firstItem(list: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = list;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(list: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = list;
        return <HTMLElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousItem = <HTMLElement | null>walker.previousNode();
        return previousItem;
    }

    #nextItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const nextItem = <HTMLElement | null>walker.nextNode();
        return nextItem;
    }

    #handleDragEndEvent(event: DragEvent): void {
        const {currentTarget} = event;
        const targetList = <HTMLElement>currentTarget;
        this.#setDropTargetItem(targetList, null);
    }

    #handleDragEnterEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".treeitem");
        const targetList = <HTMLElement>currentTarget;
        if (targetItem) {
            this.#setDropTargetItem(targetList, targetItem);
        }
        event.preventDefault();
    }

    #handleDragOverEvent(event: DragEvent): void {
        event.preventDefault();
    }

    #handleDragLeaveEvent(event: DragEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetList = <HTMLElement>currentTarget;
        if (relatedTarget) {
            const relatedTargetRoot = (<Node>relatedTarget).getRootNode();
            const relatedTargetHost =
                relatedTargetRoot instanceof ShadowRoot ?
                relatedTargetRoot.host :
                relatedTarget;
            if (!targetList.contains(<Node>relatedTargetHost)) {
                this.#setDropTargetItem(targetList, null);
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
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".listitem");
        if (targetItem) {
            this.#setActiveItem(targetTree, targetItem);
            targetTree.tabIndex = -1;
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        const targetList = <HTMLElement>currentTarget;
        const activeItem = this.#getActiveItem(targetList);
        switch (key) {
            case "a": {
                const {ctrlKey} = event;
                if (ctrlKey) {
                    if (activeItem) {
                        const walker = this.#walker;
                        walker.currentNode = activeItem;
                        const firstItem = <HTMLElement>(
                            walker.currentNode = walker.parentNode() ?? targetList, walker.firstChild()
                        );
                        const lastItem = <HTMLElement>(
                            walker.currentNode = walker.parentNode() ?? targetList, walker.lastChild()
                        );
                        if (firstItem && lastItem) {
                            const range = this.#getItemsRange(firstItem, lastItem);
                            if (range) {
                                this.#setSelection(targetList, ...range);
                            }
                        }
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
                            const selected = listitemWidget.getSelected(previousItem);
                            selected ?
                                this.#removeFromSelection(targetList, previousItem) :
                                this.#addToSelection(targetList, previousItem);
                        }
                    }
                }
                else {
                    const firstItem = this.#firstItem(targetList);
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
                            const selected = listitemWidget.getSelected(nextItem);
                            selected ?
                                this.#removeFromSelection(targetList, nextItem) :
                                this.#addToSelection(targetList, nextItem);
                        }
                    }
                }
                else {
                    const lastItem = this.#lastItem(targetList);
                    if (lastItem) {
                        lastItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem(targetList);
                if (firstItem) {
                    firstItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem(targetList);
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
                this.#clearSelection(targetList);
                this.#setActiveItem(targetList, null);
                targetList.focus();
                event.stopPropagation();
                break;
            }
        }
    }

    #handleMouseDownEvent(event: MouseEvent): void {
        const {currentTarget, target, ctrlKey, shiftKey, button} = event;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".listitem");
        const targetList = <HTMLElement>currentTarget;
        if (targetItem) {
            const selected = listitemWidget.getSelected(targetItem);
            switch (button) {
                case 0: {
                    if (!shiftKey && !ctrlKey) {
                        this.#setSelection(targetList, targetItem);
                    }
                    else if (ctrlKey) {
                        if (selected) {
                            targetItem.blur();
                            this.#removeFromSelection(targetList, targetItem);
                        }
                        else {
                            this.#addToSelection(targetList, targetItem);
                        }
                    }
                    else if (shiftKey) {
                        const activeItem = this.#getActiveItem(targetList);
                        if (activeItem) {
                            const range = this.#getItemsRange(
                                activeItem,
                                targetItem
                            );
                            if (range) {
                                this.#setSelection(targetList, ...range);
                            }
                        }
                        event.stopPropagation();
                    }
                    break;
                }
                case 2: {
                    if (!selected) {
                        this.#setSelection(targetList, targetItem);
                    }
                    break;
                }
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetList = <HTMLElement>currentTarget;
        const lostFocusWithin = !targetList.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            targetList.tabIndex = 0;
        }
    }

    #handleSelectEvent(event: Event): void {
        const {currentTarget} = event;
        const targetList = <HTMLElement>currentTarget;
        if (targetList) {
            if (this.#onSelection.get(targetList)) {
                this.#hasSelectionChanged.set(targetList, true);
            }
            else {
                targetList.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            }
        }
    }
}));