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
    "__#14814@#template": HTMLElement;
    "__#14814@#walker": TreeWalker;
    "__#14814@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#14814@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        multisectable?: boolean;
    }): HTMLElement;
    slot(tree: HTMLElement): HTMLElement;
    slottedCallback(tree: HTMLElement, slot: HTMLElement): void;
    items(tree: HTMLElement): HTMLElement[];
    selectedItems(tree: HTMLElement): HTMLElement[];
    beginSelection(tree: HTMLElement): void;
    endSelection(tree: HTMLElement): void;
    setMultiSelectable(tree: HTMLElement, value: boolean): void;
    getMultiSelectable(tree: HTMLElement): boolean;
    "__#14814@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#14814@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#14814@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14814@#nodeFilter"(node: Node): number;
    "__#14814@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14814@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14814@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14814@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14814@#clearSelection"(tree: HTMLElement): void;
    "__#14814@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14814@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#14814@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#14814@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14814@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14814@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#14814@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#14814@#handleDragEndEvent"(event: DragEvent): void;
    "__#14814@#handleDragEnterEvent"(event: DragEvent): void;
    "__#14814@#handleDragOverEvent"(event: DragEvent): void;
    "__#14814@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#14814@#handleDropEvent"(event: DragEvent): void;
    "__#14814@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14814@#handleFocusEvent"(event: FocusEvent): void;
    "__#14814@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14814@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14814@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
