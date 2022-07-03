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
    "__#19079@#template": HTMLElement;
    "__#19079@#walker": TreeWalker;
    "__#19079@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#19079@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#19079@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#19079@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#19079@#getDropTarget"(tree: HTMLElement): boolean;
    "__#19079@#setDropTarget"(tree: HTMLElement, droptarget: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    "__#19079@#nodeFilter"(node: Node): number;
    "__#19079@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#19079@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#19079@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#19079@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#19079@#clearSelection"(tree: HTMLElement): void;
    "__#19079@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#19079@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#19079@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#19079@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#19079@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#19079@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#19079@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#19079@#handleClickEvent"(event: MouseEvent): void;
    "__#19079@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#19079@#handleDragEndEvent"(event: DragEvent): void;
    "__#19079@#handleDragEnterEvent"(event: DragEvent): void;
    "__#19079@#handleDragOverEvent"(event: DragEvent): void;
    "__#19079@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#19079@#handleDragStartEvent"(event: DragEvent): void;
    "__#19079@#handleDropEvent"(event: DragEvent): void;
    "__#19079@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#19079@#handleFocusEvent"(event: FocusEvent): void;
    "__#19079@#handleFocusInEvent"(event: FocusEvent): void;
    "__#19079@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#19079@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
