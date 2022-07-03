import { WidgetFactory } from "../Widget";
export { toolbarWidget };
declare global {
    interface WidgetNameMap {
        "toolbar": ToolBarWidgetFactory;
    }
}
interface ToolBarWidgetFactory extends WidgetFactory {
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
}
declare type ToolBarOrientation = "horizontal" | "vertical";
declare var toolbarWidget: {
    "__#18857@#template": HTMLElement;
    "__#18857@#walker": TreeWalker;
    create(): HTMLElement;
    "__#18857@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#18857@#walkerNodeFilter"(node: Node): number;
    "__#18857@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#18857@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#18857@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#18857@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#18857@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#18857@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#18857@#handleFocusEvent"(event: FocusEvent): void;
    "__#18857@#handleFocusInEvent"(event: FocusEvent): void;
    "__#18857@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#18857@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#18857@#handleClickEvent"(event: Event): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
