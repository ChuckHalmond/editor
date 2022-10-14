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
    "__#41@#template": HTMLElement;
    "__#41@#walker": TreeWalker;
    "__#41@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#41@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#41@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#41@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#41@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#41@#nodeFilter"(node: Node): number;
    "__#41@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#41@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#41@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#41@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#41@#clearSelection"(tree: HTMLElement): void;
    "__#41@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#41@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#41@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#41@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#41@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#41@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#41@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#41@#handleDragEndEvent"(event: DragEvent): void;
    "__#41@#handleDragEnterEvent"(event: DragEvent): void;
    "__#41@#handleDragOverEvent"(event: DragEvent): void;
    "__#41@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#41@#handleDropEvent"(event: DragEvent): void;
    "__#41@#handleFocusEvent"(event: FocusEvent): void;
    "__#41@#handleFocusInEvent"(event: FocusEvent): void;
    "__#41@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#41@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#41@#handleSelectEvent"(event: Event): void;
};
