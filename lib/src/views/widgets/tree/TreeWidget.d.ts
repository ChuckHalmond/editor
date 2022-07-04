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
    "__#14226@#template": HTMLElement;
    "__#14226@#walker": TreeWalker;
    "__#14226@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#14226@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
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
    "__#14226@#getActiveItem"(tree: HTMLElement): HTMLElement | null;
    "__#14226@#getDropTargetItem"(tree: HTMLElement): HTMLElement | null;
    "__#14226@#setDropTargetItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14226@#nodeFilter"(node: Node): number;
    "__#14226@#getItemsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14226@#setSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14226@#addToSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14226@#removeFromSelection"(tree: HTMLElement, ...items: HTMLElement[]): void;
    "__#14226@#clearSelection"(tree: HTMLElement): void;
    "__#14226@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14226@#firstItem"(tree: HTMLElement): HTMLElement | null;
    "__#14226@#lastItem"(tree: HTMLElement): HTMLElement | null;
    "__#14226@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14226@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14226@#deepestItem"(item: HTMLElement): HTMLElement;
    "__#14226@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#14226@#handleDragEndEvent"(event: DragEvent): void;
    "__#14226@#handleDragEnterEvent"(event: DragEvent): void;
    "__#14226@#handleDragOverEvent"(event: DragEvent): void;
    "__#14226@#handleDragLeaveEvent"(event: DragEvent): void;
    "__#14226@#handleDropEvent"(event: DragEvent): void;
    "__#14226@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14226@#handleFocusEvent"(event: FocusEvent): void;
    "__#14226@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14226@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14226@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
