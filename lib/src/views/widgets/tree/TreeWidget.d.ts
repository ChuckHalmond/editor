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
    "__#19@#template": HTMLElement;
    "__#19@#walker": TreeWalker;
    "__#19@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#19@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#19@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#19@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#19@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#19@#nodeFilter"(node: Node): number;
    "__#19@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#19@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#19@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#19@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#19@#clearSelection"(tree: HTMLElement): void;
    "__#19@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#19@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#19@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#19@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#19@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#19@#handleDragEndEvent"(event: DragEvent): void;
    "__#19@#handleDragEnterEvent"(event: DragEvent): void;
    "__#19@#handleDragOverEvent"(event: DragEvent): void;
    "__#19@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#19@#handleDropEvent"(event: DragEvent): void;
    "__#19@#handleFocusEvent"(event: FocusEvent): void;
    "__#19@#handleFocusInEvent"(event: FocusEvent): void;
    "__#19@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#19@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#19@#handleSelectEvent"(event: Event): void;
};
