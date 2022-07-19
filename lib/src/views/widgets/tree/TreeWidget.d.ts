import { WidgetFactory } from "../Widget";
export { treeWidget };
interface TreeWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
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
    "__#14146@#template": HTMLElement;
    "__#14146@#walker": TreeWalker;
    "__#14146@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#14146@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
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
    "__#14146@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#14146@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#14146@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14146@#nodeFilter"(node: Node): number;
    "__#14146@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14146@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14146@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14146@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14146@#clearSelection"(tree: HTMLElement): void;
    "__#14146@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14146@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#14146@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#14146@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14146@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14146@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#14146@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#14146@#handleDragEndEvent"(event: DragEvent): void;
    "__#14146@#handleDragEnterEvent"(event: DragEvent): void;
    "__#14146@#handleDragOverEvent"(event: DragEvent): void;
    "__#14146@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#14146@#handleDropEvent"(event: DragEvent): void;
    "__#14146@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14146@#handleFocusEvent"(event: FocusEvent): void;
    "__#14146@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14146@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14146@#handleSelectEvent"(event: Event): void;
};
