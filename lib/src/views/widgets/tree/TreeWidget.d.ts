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
    "__#17802@#template": HTMLElement;
    "__#17802@#walker": TreeWalker;
    "__#17802@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#17802@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#17802@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#17802@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#17802@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#17802@#nodeFilter"(node: Node): number;
    "__#17802@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17802@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#17802@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#17802@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#17802@#clearSelection"(tree: HTMLElement): void;
    "__#17802@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#17802@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#17802@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#17802@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#17802@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#17802@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#17802@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#17802@#handleDragEndEvent"(event: DragEvent): void;
    "__#17802@#handleDragEnterEvent"(event: DragEvent): void;
    "__#17802@#handleDragOverEvent"(event: DragEvent): void;
    "__#17802@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#17802@#handleDropEvent"(event: DragEvent): void;
    "__#17802@#handleFocusEvent"(event: FocusEvent): void;
    "__#17802@#handleFocusInEvent"(event: FocusEvent): void;
    "__#17802@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17802@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17802@#handleSelectEvent"(event: Event): void;
};
