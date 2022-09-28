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
    "__#52@#template": HTMLElement;
    "__#52@#walker": TreeWalker;
    "__#52@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#52@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#52@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#52@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#52@#nodeFilter"(node: Node): number;
    "__#52@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#52@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#52@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#52@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#52@#clearSelection"(list: HTMLElement): void;
    "__#52@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#52@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#52@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#52@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#52@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#handleDragEndEvent"(event: DragEvent): void;
    "__#52@#handleDragEnterEvent"(event: DragEvent): void;
    "__#52@#handleDragOverEvent"(event: DragEvent): void;
    "__#52@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#52@#handleDragStartEvent"(event: DragEvent): void;
    "__#52@#handleDropEvent"(event: DragEvent): void;
    "__#52@#handleFocusEvent"(event: FocusEvent): void;
    "__#52@#handleFocusInEvent"(event: FocusEvent): void;
    "__#52@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#52@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#52@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#52@#handleSelectEvent"(event: Event): void;
};
