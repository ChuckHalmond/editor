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
    "__#49@#template": HTMLElement;
    "__#49@#walker": TreeWalker;
    "__#49@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#49@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#49@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#49@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#49@#getDropTarget"(tree: HTMLElement): boolean;
    "__#49@#setDropTarget"(tree: HTMLElement, droptarget: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    "__#49@#nodeFilter"(node: Node): number;
    "__#49@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#49@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#49@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#49@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#49@#clearSelection"(tree: HTMLElement): void;
    "__#49@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#49@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#49@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#49@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#49@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#49@#handleClickEvent"(event: MouseEvent): void;
    "__#49@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#49@#handleDragEndEvent"(event: DragEvent): void;
    "__#49@#handleDragEnterEvent"(event: DragEvent): void;
    "__#49@#handleDragOverEvent"(event: DragEvent): void;
    "__#49@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#49@#handleDragStartEvent"(event: DragEvent): void;
    "__#49@#handleDropEvent"(event: DragEvent): void;
    "__#49@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#49@#handleFocusEvent"(event: FocusEvent): void;
    "__#49@#handleFocusInEvent"(event: FocusEvent): void;
    "__#49@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#49@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
