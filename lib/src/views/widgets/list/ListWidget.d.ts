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
    "__#50@#template": HTMLElement;
    "__#50@#walker": TreeWalker;
    "__#50@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#50@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#50@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#50@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#50@#nodeFilter"(node: Node): number;
    "__#50@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#50@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#50@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#50@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#50@#clearSelection"(list: HTMLElement): void;
    "__#50@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#50@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#50@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#50@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#50@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#handleDragEndEvent"(event: DragEvent): void;
    "__#50@#handleDragEnterEvent"(event: DragEvent): void;
    "__#50@#handleDragOverEvent"(event: DragEvent): void;
    "__#50@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#50@#handleDragStartEvent"(event: DragEvent): void;
    "__#50@#handleDropEvent"(event: DragEvent): void;
    "__#50@#handleFocusEvent"(event: FocusEvent): void;
    "__#50@#handleFocusInEvent"(event: FocusEvent): void;
    "__#50@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#50@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#50@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#50@#handleSelectEvent"(event: Event): void;
};
