import { WidgetFactory } from "../Widget";
export { treeWidget };
interface TreeWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
    }): HTMLElement;
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
    "__#13@#template": HTMLElement;
    "__#13@#walker": TreeWalker;
    "__#13@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#13@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
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
    "__#13@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#13@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#13@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#13@#nodeFilter"(node: Node): number;
    "__#13@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#13@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#13@#clearSelection"(tree: HTMLElement): void;
    "__#13@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#13@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#13@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#13@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#13@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#13@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#13@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#13@#handleDragEndEvent"(event: DragEvent): void;
    "__#13@#handleDragEnterEvent"(event: DragEvent): void;
    "__#13@#handleDragOverEvent"(event: DragEvent): void;
    "__#13@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#13@#handleDropEvent"(event: DragEvent): void;
    "__#13@#handleFocusEvent"(event: FocusEvent): void;
    "__#13@#handleFocusInEvent"(event: FocusEvent): void;
    "__#13@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#13@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#13@#handleSelectEvent"(event: Event): void;
};
