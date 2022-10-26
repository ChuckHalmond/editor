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
    "__#66@#template": HTMLElement;
    "__#66@#walker": TreeWalker;
    "__#66@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#66@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#66@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#66@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#66@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#66@#nodeFilter"(node: Node): number;
    "__#66@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#66@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#66@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#66@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#66@#clearSelection"(tree: HTMLElement): void;
    "__#66@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#66@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#66@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#66@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#66@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#66@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#66@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#66@#handleDragEndEvent"(event: DragEvent): void;
    "__#66@#handleDragEnterEvent"(event: DragEvent): void;
    "__#66@#handleDragOverEvent"(event: DragEvent): void;
    "__#66@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#66@#handleDropEvent"(event: DragEvent): void;
    "__#66@#handleFocusEvent"(event: FocusEvent): void;
    "__#66@#handleFocusInEvent"(event: FocusEvent): void;
    "__#66@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#66@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#66@#handleSelectEvent"(event: Event): void;
};
