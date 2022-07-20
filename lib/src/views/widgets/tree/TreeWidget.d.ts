import { WidgetFactory } from "../Widget";
export { treeWidget };
interface TreeWidgetFactory extends WidgetFactory {
    create(init: {
        multisectable?: boolean;
        tabIndex?: number;
    }): HTMLElement;
    setTabIndex(tree: HTMLElement, value: number): void;
    getTabIndex(tree: HTMLElement): number;
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
    "__#30212@#template": HTMLElement;
    "__#30212@#walker": TreeWalker;
    "__#30212@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#30212@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        multisectable?: boolean;
        tabIndex?: number;
    }): HTMLElement;
    slot(tree: HTMLElement): HTMLElement;
    slottedCallback(tree: HTMLElement, slot: HTMLElement): void;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    setTabIndex(tree: HTMLElement, value: number): void;
    getTabIndex(tree: HTMLElement): number;
    "__#30212@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#30212@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#30212@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#30212@#nodeFilter"(node: Node): number;
    "__#30212@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#30212@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#30212@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#30212@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#30212@#clearSelection"(tree: HTMLElement): void;
    "__#30212@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#30212@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#30212@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#30212@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#30212@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#30212@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#30212@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#30212@#handleDragEndEvent"(event: DragEvent): void;
    "__#30212@#handleDragEnterEvent"(event: DragEvent): void;
    "__#30212@#handleDragOverEvent"(event: DragEvent): void;
    "__#30212@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#30212@#handleDropEvent"(event: DragEvent): void;
    "__#30212@#handleFocusEvent"(event: FocusEvent): void;
    "__#30212@#handleFocusInEvent"(event: FocusEvent): void;
    "__#30212@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#30212@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#30212@#handleSelectEvent"(event: Event): void;
};
