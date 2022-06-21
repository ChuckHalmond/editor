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
    "__#13305@#template": HTMLElement;
    "__#13305@#walker": TreeWalker;
    "__#13305@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#13305@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#13305@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#13305@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#13305@#getDropTarget"(tree: HTMLElement): boolean;
    "__#13305@#setDropTarget"(tree: HTMLElement, droptarget: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    "__#13305@#nodeFilter"(node: Node): number;
    "__#13305@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#13305@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13305@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13305@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13305@#clearSelection"(tree: HTMLElement): void;
    "__#13305@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#13305@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#13305@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#13305@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#13305@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#13305@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#13305@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#13305@#handleClickEvent"(event: MouseEvent): void;
    "__#13305@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#13305@#handleDragEndEvent"(event: DragEvent): void;
    "__#13305@#handleDragEnterEvent"(event: DragEvent): void;
    "__#13305@#handleDragOverEvent"(event: DragEvent): void;
    "__#13305@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#13305@#handleDragStartEvent"(event: DragEvent): void;
    "__#13305@#handleDropEvent"(event: DragEvent): void;
    "__#13305@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#13305@#handleFocusEvent"(event: FocusEvent): void;
    "__#13305@#handleFocusInEvent"(event: FocusEvent): void;
    "__#13305@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#13305@#handleSelectEvent"(event: Event): void;
    "__#13305@#handleSlotChangeEvent"(event: Event): void;
    readonly slots: string[];
};
