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
    "__#53@#template": HTMLElement;
    "__#53@#walker": TreeWalker;
    "__#53@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#53@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#53@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#53@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#53@#nodeFilter"(node: Node): number;
    "__#53@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#53@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#53@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#53@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#53@#clearSelection"(list: HTMLElement): void;
    "__#53@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#53@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#53@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#53@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#53@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#handleDragEndEvent"(event: DragEvent): void;
    "__#53@#handleDragEnterEvent"(event: DragEvent): void;
    "__#53@#handleDragOverEvent"(event: DragEvent): void;
    "__#53@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#53@#handleDragStartEvent"(event: DragEvent): void;
    "__#53@#handleDropEvent"(event: DragEvent): void;
    "__#53@#handleFocusEvent"(event: FocusEvent): void;
    "__#53@#handleFocusInEvent"(event: FocusEvent): void;
    "__#53@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#53@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#53@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#53@#handleSelectEvent"(event: Event): void;
};
