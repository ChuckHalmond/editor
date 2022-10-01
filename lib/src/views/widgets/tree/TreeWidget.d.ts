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
    "__#43@#template": HTMLElement;
    "__#43@#walker": TreeWalker;
    "__#43@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#43@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#43@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#43@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#43@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#43@#nodeFilter"(node: Node): number;
    "__#43@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#43@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#43@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#43@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#43@#clearSelection"(tree: HTMLElement): void;
    "__#43@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#43@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#43@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#43@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#43@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#43@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#43@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#43@#handleDragEndEvent"(event: DragEvent): void;
    "__#43@#handleDragEnterEvent"(event: DragEvent): void;
    "__#43@#handleDragOverEvent"(event: DragEvent): void;
    "__#43@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#43@#handleDropEvent"(event: DragEvent): void;
    "__#43@#handleFocusEvent"(event: FocusEvent): void;
    "__#43@#handleFocusInEvent"(event: FocusEvent): void;
    "__#43@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#43@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#43@#handleSelectEvent"(event: Event): void;
};
