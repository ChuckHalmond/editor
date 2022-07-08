import { WidgetFactory } from "../Widget";
export { listWidget };
interface ListWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
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
    "__#13309@#template": HTMLElement;
    "__#13309@#walker": TreeWalker;
    "__#13309@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#13309@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        multisectable?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(list: HTMLElement): HTMLElement;
    slottedCallback(list: HTMLElement, slot: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#13309@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#13309@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    items(list: HTMLElement): HTMLElement[];
    selectedItems(list: HTMLElement): HTMLElement[];
    beginSelection(list: HTMLElement): void;
    endSelection(list: HTMLElement): void;
    "__#13309@#nodeFilter"(node: Node): number;
    "__#13309@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#13309@#setSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#13309@#addToSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#13309@#removeFromSelection"(list: HTMLElement, ...items: HTMLElement[]): void;
    "__#13309@#clearSelection"(list: HTMLElement): void;
    "__#13309@#setActiveItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#13309@#setDropTargetItem"(list: HTMLElement, item: HTMLElement | null): void;
    "__#13309@#firstItem"(list: HTMLElement): HTMLElement | null;
    "__#13309@#lastItem"(list: HTMLElement): HTMLElement | null;
    "__#13309@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#13309@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#13309@#handleDragEndEvent"(event: DragEvent): void;
    "__#13309@#handleDragEnterEvent"(event: DragEvent): void;
    "__#13309@#handleDragOverEvent"(event: DragEvent): void;
    "__#13309@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#13309@#handleDragStartEvent"(event: DragEvent): void;
    "__#13309@#handleDropEvent"(event: DragEvent): void;
    "__#13309@#handleFocusEvent"(event: FocusEvent): void;
    "__#13309@#handleFocusInEvent"(event: FocusEvent): void;
    "__#13309@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#13309@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#13309@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#13309@#handleSelectEvent"(event: Event): void;
};
