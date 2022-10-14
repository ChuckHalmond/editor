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
    "__#44@#template": HTMLElement;
    "__#44@#walker": TreeWalker;
    "__#44@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#44@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#44@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#44@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#44@#nodeFilter"(node: Node): number;
    "__#44@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#44@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#44@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#44@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#44@#clearSelection"(list: HTMLElement): void;
    "__#44@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#44@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#44@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#44@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#44@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#44@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#44@#handleDragEndEvent"(event: DragEvent): void;
    "__#44@#handleDragEnterEvent"(event: DragEvent): void;
    "__#44@#handleDragOverEvent"(event: DragEvent): void;
    "__#44@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#44@#handleDragStartEvent"(event: DragEvent): void;
    "__#44@#handleDropEvent"(event: DragEvent): void;
    "__#44@#handleFocusEvent"(event: FocusEvent): void;
    "__#44@#handleFocusInEvent"(event: FocusEvent): void;
    "__#44@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#44@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#44@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#44@#handleSelectEvent"(event: Event): void;
};
