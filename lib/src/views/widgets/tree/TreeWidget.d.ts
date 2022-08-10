import { WidgetFactory } from "../Widget";
export { treeWidget };
interface TreeWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
    }): HTMLElement;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
}
declare global {
    interface WidgetNameMap {
        "tree": TreeWidgetFactory;
    }
}
declare var treeWidget: {
    "__#7505@#template": HTMLElement;
    "__#7505@#walker": TreeWalker;
    "__#7505@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#7505@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        multisectable?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(tree: HTMLElement): HTMLElement;
    slottedCallback(tree: HTMLElement, slot: HTMLElement): void;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#7505@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#7505@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#7505@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#7505@#nodeFilter"(node: Node): number;
    "__#7505@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#7505@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#7505@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#7505@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#7505@#clearSelection"(tree: HTMLElement): void;
    "__#7505@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#7505@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#7505@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#7505@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#7505@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#7505@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#7505@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#7505@#handleDragEndEvent"(event: DragEvent): void;
    "__#7505@#handleDragEnterEvent"(event: DragEvent): void;
    "__#7505@#handleDragOverEvent"(event: DragEvent): void;
    "__#7505@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#7505@#handleDropEvent"(event: DragEvent): void;
    "__#7505@#handleFocusEvent"(event: FocusEvent): void;
    "__#7505@#handleFocusInEvent"(event: FocusEvent): void;
    "__#7505@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#7505@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#7505@#handleSelectEvent"(event: Event): void;
};
