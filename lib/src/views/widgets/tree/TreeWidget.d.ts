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
    "__#27@#template": HTMLElement;
    "__#27@#walker": TreeWalker;
    "__#27@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#27@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
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
    "__#27@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#27@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#27@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#27@#nodeFilter"(node: Node): number;
    "__#27@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#27@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#27@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#27@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#27@#clearSelection"(tree: HTMLElement): void;
    "__#27@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#27@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#27@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#27@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#27@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#27@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#27@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#27@#handleDragEndEvent"(event: DragEvent): void;
    "__#27@#handleDragEnterEvent"(event: DragEvent): void;
    "__#27@#handleDragOverEvent"(event: DragEvent): void;
    "__#27@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#27@#handleDropEvent"(event: DragEvent): void;
    "__#27@#handleFocusEvent"(event: FocusEvent): void;
    "__#27@#handleFocusInEvent"(event: FocusEvent): void;
    "__#27@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#27@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#27@#handleSelectEvent"(event: Event): void;
};
