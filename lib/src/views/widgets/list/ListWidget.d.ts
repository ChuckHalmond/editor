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
    "__#10143@#template": HTMLElement;
    "__#10143@#walker": TreeWalker;
    "__#10143@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#10143@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        multisectable?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(list: HTMLElement): HTMLElement;
    slottedCallback(list: HTMLElement, slot: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#10143@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#10143@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#10143@#nodeFilter"(node: Node): number;
    "__#10143@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#10143@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#10143@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#10143@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#10143@#clearSelection"(list: HTMLElement): void;
    "__#10143@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#10143@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#10143@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#10143@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#10143@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#10143@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#10143@#handleDragEndEvent"(event: DragEvent): void;
    "__#10143@#handleDragEnterEvent"(event: DragEvent): void;
    "__#10143@#handleDragOverEvent"(event: DragEvent): void;
    "__#10143@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#10143@#handleDragStartEvent"(event: DragEvent): void;
    "__#10143@#handleDropEvent"(event: DragEvent): void;
    "__#10143@#handleFocusEvent"(event: FocusEvent): void;
    "__#10143@#handleFocusInEvent"(event: FocusEvent): void;
    "__#10143@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#10143@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#10143@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#10143@#handleSelectEvent"(event: Event): void;
};
