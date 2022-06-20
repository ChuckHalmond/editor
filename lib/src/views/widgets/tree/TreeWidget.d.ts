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
    "__#17895@#template": HTMLElement;
    "__#17895@#walker": TreeWalker;
    "__#17895@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#17895@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(): HTMLElement;
    "__#17895@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#17895@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#17895@#getDropTarget"(tree: HTMLElement): boolean;
    "__#17895@#setDropTarget"(tree: HTMLElement, droptarget: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    "__#17895@#nodeFilter"(node: Node): number;
    "__#17895@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17895@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#17895@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#17895@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#17895@#clearSelection"(tree: HTMLElement): void;
    "__#17895@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#17895@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#17895@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#17895@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#17895@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#17895@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#17895@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#17895@#handleClickEvent"(event: MouseEvent): void;
    "__#17895@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#17895@#handleDragEndEvent"(event: DragEvent): void;
    "__#17895@#handleDragEnterEvent"(event: DragEvent): void;
    "__#17895@#handleDragOverEvent"(event: DragEvent): void;
    "__#17895@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#17895@#handleDragStartEvent"(event: DragEvent): void;
    "__#17895@#handleDropEvent"(event: DragEvent): void;
    "__#17895@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17895@#handleFocusEvent"(event: FocusEvent): void;
    "__#17895@#handleFocusInEvent"(event: FocusEvent): void;
    "__#17895@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17895@#handleSelectEvent"(event: Event): void;
    "__#17895@#handleSlotChangeEvent"(event: Event): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
