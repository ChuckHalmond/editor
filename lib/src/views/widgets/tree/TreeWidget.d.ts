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
    "__#50@#template": HTMLElement;
    "__#50@#walker": TreeWalker;
    "__#50@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#50@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#50@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#50@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#50@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#50@#nodeFilter"(node: Node): number;
    "__#50@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#50@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#50@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#50@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#50@#clearSelection"(tree: HTMLElement): void;
    "__#50@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#50@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#50@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#50@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#50@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#50@#handleDragEndEvent"(event: DragEvent): void;
    "__#50@#handleDragEnterEvent"(event: DragEvent): void;
    "__#50@#handleDragOverEvent"(event: DragEvent): void;
    "__#50@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#50@#handleDropEvent"(event: DragEvent): void;
    "__#50@#handleFocusEvent"(event: FocusEvent): void;
    "__#50@#handleFocusInEvent"(event: FocusEvent): void;
    "__#50@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#50@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#50@#handleSelectEvent"(event: Event): void;
};
