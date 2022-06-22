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
    "__#15203@#template": HTMLElement;
    "__#15203@#walker": TreeWalker;
    "__#15203@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#15203@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#15203@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#15203@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#15203@#getDropTarget"(tree: HTMLElement): boolean;
    "__#15203@#setDropTarget"(tree: HTMLElement, droptarget: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    "__#15203@#nodeFilter"(node: Node): number;
    "__#15203@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#15203@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#15203@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#15203@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#15203@#clearSelection"(tree: HTMLElement): void;
    "__#15203@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#15203@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#15203@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#15203@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#15203@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#15203@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#15203@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#15203@#handleClickEvent"(event: MouseEvent): void;
    "__#15203@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#15203@#handleDragEndEvent"(event: DragEvent): void;
    "__#15203@#handleDragEnterEvent"(event: DragEvent): void;
    "__#15203@#handleDragOverEvent"(event: DragEvent): void;
    "__#15203@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#15203@#handleDragStartEvent"(event: DragEvent): void;
    "__#15203@#handleDropEvent"(event: DragEvent): void;
    "__#15203@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#15203@#handleFocusEvent"(event: FocusEvent): void;
    "__#15203@#handleFocusInEvent"(event: FocusEvent): void;
    "__#15203@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#15203@#handleSelectEvent"(event: Event): void;
    "__#15203@#handleSlotChangeEvent"(event: Event): void;
    readonly slots: string[];
};
