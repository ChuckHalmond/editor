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
    "__#45@#template": HTMLElement;
    "__#45@#walker": TreeWalker;
    "__#45@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#45@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#45@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#45@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#45@#nodeFilter"(node: Node): number;
    "__#45@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#45@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#45@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#45@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#45@#clearSelection"(list: HTMLElement): void;
    "__#45@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#45@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#45@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#45@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#45@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#45@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#45@#handleDragEndEvent"(event: DragEvent): void;
    "__#45@#handleDragEnterEvent"(event: DragEvent): void;
    "__#45@#handleDragOverEvent"(event: DragEvent): void;
    "__#45@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#45@#handleDragStartEvent"(event: DragEvent): void;
    "__#45@#handleDropEvent"(event: DragEvent): void;
    "__#45@#handleFocusEvent"(event: FocusEvent): void;
    "__#45@#handleFocusInEvent"(event: FocusEvent): void;
    "__#45@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#45@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#45@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#45@#handleSelectEvent"(event: Event): void;
};
