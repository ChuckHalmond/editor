import { WidgetFactory } from "../Widget";
export { listWidget };
interface ListWidgetFactory extends WidgetFactory {
    create(properties: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
    }): HTMLElement;
    items(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    selectedItems(list: HTMLElement): HTMLElement[];
}
declare global {
    interface WidgetNameMap {
        "list": ListWidgetFactory;
    }
}
declare var listWidget: {
    "__#17804@#template": HTMLElement;
    "__#17804@#walker": TreeWalker;
    "__#17804@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#17804@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
    }): HTMLElement;
    slot(list: HTMLElement): HTMLElement;
    slottedCallback(list: HTMLElement, slot: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#17804@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#17804@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#17804@#nodeFilter"(node: Node): number;
    "__#17804@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17804@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#17804@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#17804@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#17804@#clearSelection"(list: HTMLElement): void;
    "__#17804@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#17804@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#17804@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#17804@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#17804@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#17804@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#17804@#handleDragEndEvent"(event: DragEvent): void;
    "__#17804@#handleDragEnterEvent"(event: DragEvent): void;
    "__#17804@#handleDragOverEvent"(event: DragEvent): void;
    "__#17804@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#17804@#handleDragStartEvent"(event: DragEvent): void;
    "__#17804@#handleDropEvent"(event: DragEvent): void;
    "__#17804@#handleFocusEvent"(event: FocusEvent): void;
    "__#17804@#handleFocusInEvent"(event: FocusEvent): void;
    "__#17804@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17804@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#17804@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17804@#handleSelectEvent"(event: Event): void;
};
