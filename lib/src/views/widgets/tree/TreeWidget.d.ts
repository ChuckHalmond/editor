import { WidgetFactory } from "../Widget";
export { treeWidget };
interface TreeWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
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
    "__#13306@#template": HTMLElement;
    "__#13306@#walker": TreeWalker;
    "__#13306@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#13306@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
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
    "__#13306@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#13306@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#13306@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#13306@#nodeFilter"(node: Node): number;
    "__#13306@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#13306@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13306@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13306@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13306@#clearSelection"(tree: HTMLElement): void;
    "__#13306@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#13306@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#13306@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#13306@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#13306@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#13306@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#13306@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#13306@#handleDragEndEvent"(event: DragEvent): void;
    "__#13306@#handleDragEnterEvent"(event: DragEvent): void;
    "__#13306@#handleDragOverEvent"(event: DragEvent): void;
    "__#13306@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#13306@#handleDropEvent"(event: DragEvent): void;
    "__#13306@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#13306@#handleFocusEvent"(event: FocusEvent): void;
    "__#13306@#handleFocusInEvent"(event: FocusEvent): void;
    "__#13306@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#13306@#handleSelectEvent"(event: Event): void;
};
