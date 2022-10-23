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
    "__#42@#template": HTMLElement;
    "__#42@#walker": TreeWalker;
    "__#42@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#42@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#42@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#42@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#42@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#42@#nodeFilter"(node: Node): number;
    "__#42@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#42@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#42@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#42@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#42@#clearSelection"(tree: HTMLElement): void;
    "__#42@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#42@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#42@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#42@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#42@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#42@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#42@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#42@#handleDragEndEvent"(event: DragEvent): void;
    "__#42@#handleDragEnterEvent"(event: DragEvent): void;
    "__#42@#handleDragOverEvent"(event: DragEvent): void;
    "__#42@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#42@#handleDropEvent"(event: DragEvent): void;
    "__#42@#handleFocusEvent"(event: FocusEvent): void;
    "__#42@#handleFocusInEvent"(event: FocusEvent): void;
    "__#42@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#42@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#42@#handleSelectEvent"(event: Event): void;
};
