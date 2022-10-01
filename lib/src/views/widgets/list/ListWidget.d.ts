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
    "__#46@#template": HTMLElement;
    "__#46@#walker": TreeWalker;
    "__#46@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#46@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#46@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#46@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#46@#nodeFilter"(node: Node): number;
    "__#46@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#46@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#46@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#46@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#46@#clearSelection"(list: HTMLElement): void;
    "__#46@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#46@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#46@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#46@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#46@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#handleDragEndEvent"(event: DragEvent): void;
    "__#46@#handleDragEnterEvent"(event: DragEvent): void;
    "__#46@#handleDragOverEvent"(event: DragEvent): void;
    "__#46@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#46@#handleDragStartEvent"(event: DragEvent): void;
    "__#46@#handleDropEvent"(event: DragEvent): void;
    "__#46@#handleFocusEvent"(event: FocusEvent): void;
    "__#46@#handleFocusInEvent"(event: FocusEvent): void;
    "__#46@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#46@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#46@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#46@#handleSelectEvent"(event: Event): void;
};
