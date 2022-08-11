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
    "__#47@#template": HTMLElement;
    "__#47@#walker": TreeWalker;
    "__#47@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#47@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#47@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#47@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#47@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#47@#nodeFilter"(node: Node): number;
    "__#47@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#47@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#47@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#47@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#47@#clearSelection"(tree: HTMLElement): void;
    "__#47@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#47@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#47@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#47@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#47@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#47@#handleDragEndEvent"(event: DragEvent): void;
    "__#47@#handleDragEnterEvent"(event: DragEvent): void;
    "__#47@#handleDragOverEvent"(event: DragEvent): void;
    "__#47@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#47@#handleDropEvent"(event: DragEvent): void;
    "__#47@#handleFocusEvent"(event: FocusEvent): void;
    "__#47@#handleFocusInEvent"(event: FocusEvent): void;
    "__#47@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#47@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#47@#handleSelectEvent"(event: Event): void;
};
