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
    "__#21@#template": HTMLElement;
    "__#21@#walker": TreeWalker;
    "__#21@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#21@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#21@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#21@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#21@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#21@#nodeFilter"(node: Node): number;
    "__#21@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#21@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#21@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#21@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#21@#clearSelection"(tree: HTMLElement): void;
    "__#21@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#21@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#21@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#21@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#21@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#21@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#21@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#21@#handleDragEndEvent"(event: DragEvent): void;
    "__#21@#handleDragEnterEvent"(event: DragEvent): void;
    "__#21@#handleDragOverEvent"(event: DragEvent): void;
    "__#21@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#21@#handleDropEvent"(event: DragEvent): void;
    "__#21@#handleFocusEvent"(event: FocusEvent): void;
    "__#21@#handleFocusInEvent"(event: FocusEvent): void;
    "__#21@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#21@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#21@#handleSelectEvent"(event: Event): void;
};
