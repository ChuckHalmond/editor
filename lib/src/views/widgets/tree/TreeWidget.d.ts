import { WidgetFactory } from "../Widget";
export { treeWidget };
interface TreeWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
    }): HTMLElement;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
}
declare global {
    interface WidgetNameMap {
        "tree": TreeWidgetFactory;
    }
}
declare var treeWidget: {
    "__#32@#template": HTMLElement;
    "__#32@#walker": TreeWalker;
    "__#32@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#32@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
    }): HTMLElement;
    slot(tree: HTMLElement): HTMLElement;
    slottedCallback(tree: HTMLElement, slot: HTMLElement): void;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#32@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#32@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#32@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#32@#nodeFilter"(node: Node): number;
    "__#32@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#32@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#32@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#32@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#32@#clearSelection"(tree: HTMLElement): void;
    "__#32@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#32@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#32@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#32@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#32@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#32@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#32@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#32@#handleDragEndEvent"(event: DragEvent): void;
    "__#32@#handleDragEnterEvent"(event: DragEvent): void;
    "__#32@#handleDragOverEvent"(event: DragEvent): void;
    "__#32@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#32@#handleDropEvent"(event: DragEvent): void;
    "__#32@#handleFocusEvent"(event: FocusEvent): void;
    "__#32@#handleFocusInEvent"(event: FocusEvent): void;
    "__#32@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#32@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#32@#handleSelectEvent"(event: Event): void;
};
