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
    "__#34782@#template": HTMLElement;
    "__#34782@#walker": TreeWalker;
    "__#34782@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#34782@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        multisectable?: boolean;
    }): HTMLElement;
    slot(root: HTMLElement): HTMLElement;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    items(menu: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#34782@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#34782@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#34782@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#34782@#nodeFilter"(node: Node): number;
    "__#34782@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#34782@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#34782@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#34782@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#34782@#clearSelection"(tree: HTMLElement): void;
    "__#34782@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#34782@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#34782@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#34782@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#34782@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#34782@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#34782@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#34782@#handleDragEndEvent"(event: DragEvent): void;
    "__#34782@#handleDragEnterEvent"(event: DragEvent): void;
    "__#34782@#handleDragOverEvent"(event: DragEvent): void;
    "__#34782@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#34782@#handleDropEvent"(event: DragEvent): void;
    "__#34782@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#34782@#handleFocusEvent"(event: FocusEvent): void;
    "__#34782@#handleFocusInEvent"(event: FocusEvent): void;
    "__#34782@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#34782@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
