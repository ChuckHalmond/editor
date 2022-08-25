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
    "__#53@#template": HTMLElement;
    "__#53@#walker": TreeWalker;
    "__#53@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#53@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#53@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#53@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#53@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#53@#nodeFilter"(node: Node): number;
    "__#53@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#53@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#53@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#53@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#53@#clearSelection"(tree: HTMLElement): void;
    "__#53@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#53@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#53@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#53@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#53@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#53@#handleDragEndEvent"(event: DragEvent): void;
    "__#53@#handleDragEnterEvent"(event: DragEvent): void;
    "__#53@#handleDragOverEvent"(event: DragEvent): void;
    "__#53@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#53@#handleDropEvent"(event: DragEvent): void;
    "__#53@#handleFocusEvent"(event: FocusEvent): void;
    "__#53@#handleFocusInEvent"(event: FocusEvent): void;
    "__#53@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#53@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#53@#handleSelectEvent"(event: Event): void;
};
