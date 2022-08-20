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
    "__#55@#template": HTMLElement;
    "__#55@#walker": TreeWalker;
    "__#55@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#55@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#55@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#55@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#55@#nodeFilter"(node: Node): number;
    "__#55@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#55@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#55@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#55@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#55@#clearSelection"(list: HTMLElement): void;
    "__#55@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#55@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#55@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#55@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#55@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#handleDragEndEvent"(event: DragEvent): void;
    "__#55@#handleDragEnterEvent"(event: DragEvent): void;
    "__#55@#handleDragOverEvent"(event: DragEvent): void;
    "__#55@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#55@#handleDragStartEvent"(event: DragEvent): void;
    "__#55@#handleDropEvent"(event: DragEvent): void;
    "__#55@#handleFocusEvent"(event: FocusEvent): void;
    "__#55@#handleFocusInEvent"(event: FocusEvent): void;
    "__#55@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#55@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#55@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#55@#handleSelectEvent"(event: Event): void;
};
