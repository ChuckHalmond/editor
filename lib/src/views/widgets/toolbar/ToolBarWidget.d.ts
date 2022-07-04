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
    "__#24125@#template": HTMLElement;
    "__#24125@#walker": TreeWalker;
    create(): HTMLElement;
    "__#24125@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#24125@#walkerNodeFilter"(node: Node): number;
    "__#24125@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#24125@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#24125@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#24125@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#24125@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#24125@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#24125@#handleFocusEvent"(event: FocusEvent): void;
    "__#24125@#handleFocusInEvent"(event: FocusEvent): void;
    "__#24125@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#24125@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#24125@#handleMouseDownEvent"(event: Event): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
