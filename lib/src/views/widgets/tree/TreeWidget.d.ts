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
    "__#51@#template": HTMLElement;
    "__#51@#walker": TreeWalker;
    "__#51@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#51@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#51@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#51@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#51@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#51@#nodeFilter"(node: Node): number;
    "__#51@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#51@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#51@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#51@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#51@#clearSelection"(tree: HTMLElement): void;
    "__#51@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#51@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#51@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#51@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#51@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#51@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#51@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#51@#handleDragEndEvent"(event: DragEvent): void;
    "__#51@#handleDragEnterEvent"(event: DragEvent): void;
    "__#51@#handleDragOverEvent"(event: DragEvent): void;
    "__#51@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#51@#handleDropEvent"(event: DragEvent): void;
    "__#51@#handleFocusEvent"(event: FocusEvent): void;
    "__#51@#handleFocusInEvent"(event: FocusEvent): void;
    "__#51@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#51@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#51@#handleSelectEvent"(event: Event): void;
};
