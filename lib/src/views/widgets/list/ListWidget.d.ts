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
    "__#54@#template": HTMLElement;
    "__#54@#walker": TreeWalker;
    "__#54@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#54@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#54@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#54@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#54@#nodeFilter"(node: Node): number;
    "__#54@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#54@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#54@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#54@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#54@#clearSelection"(list: HTMLElement): void;
    "__#54@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#54@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#54@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#54@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#54@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#54@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#54@#handleDragEndEvent"(event: DragEvent): void;
    "__#54@#handleDragEnterEvent"(event: DragEvent): void;
    "__#54@#handleDragOverEvent"(event: DragEvent): void;
    "__#54@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#54@#handleDragStartEvent"(event: DragEvent): void;
    "__#54@#handleDropEvent"(event: DragEvent): void;
    "__#54@#handleFocusEvent"(event: FocusEvent): void;
    "__#54@#handleFocusInEvent"(event: FocusEvent): void;
    "__#54@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#54@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#54@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#54@#handleSelectEvent"(event: Event): void;
};
