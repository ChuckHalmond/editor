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
    "__#56@#template": HTMLElement;
    "__#56@#walker": TreeWalker;
    "__#56@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#56@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#56@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#56@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#56@#nodeFilter"(node: Node): number;
    "__#56@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#56@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#56@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#56@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#56@#clearSelection"(list: HTMLElement): void;
    "__#56@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#56@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#56@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#56@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#56@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#handleDragEndEvent"(event: DragEvent): void;
    "__#56@#handleDragEnterEvent"(event: DragEvent): void;
    "__#56@#handleDragOverEvent"(event: DragEvent): void;
    "__#56@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#56@#handleDragStartEvent"(event: DragEvent): void;
    "__#56@#handleDropEvent"(event: DragEvent): void;
    "__#56@#handleFocusEvent"(event: FocusEvent): void;
    "__#56@#handleFocusInEvent"(event: FocusEvent): void;
    "__#56@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#56@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#56@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#56@#handleSelectEvent"(event: Event): void;
};
