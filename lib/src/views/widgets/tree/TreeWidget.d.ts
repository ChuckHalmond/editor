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
    "__#52@#template": HTMLElement;
    "__#52@#walker": TreeWalker;
    "__#52@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#52@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#52@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#52@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#52@#getDropTarget"(tree: HTMLElement): boolean;
    "__#52@#setDropTarget"(tree: HTMLElement, droptarget: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    "__#52@#nodeFilter"(node: Node): number;
    "__#52@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#52@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#52@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#52@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#52@#clearSelection"(tree: HTMLElement): void;
    "__#52@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#52@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#52@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#52@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#52@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#52@#handleClickEvent"(event: MouseEvent): void;
    "__#52@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#52@#handleDragEndEvent"(event: DragEvent): void;
    "__#52@#handleDragEnterEvent"(event: DragEvent): void;
    "__#52@#handleDragOverEvent"(event: DragEvent): void;
    "__#52@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#52@#handleDragStartEvent"(event: DragEvent): void;
    "__#52@#handleDropEvent"(event: DragEvent): void;
    "__#52@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#52@#handleFocusEvent"(event: FocusEvent): void;
    "__#52@#handleFocusInEvent"(event: FocusEvent): void;
    "__#52@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#52@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
