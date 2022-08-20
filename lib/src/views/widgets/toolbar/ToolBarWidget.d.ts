import { WidgetFactory } from "../Widget";
export { toolbarWidget };
declare global {
    interface WidgetNameMap {
        "toolbar": ToolBarWidgetFactory;
    }
}
interface ToolBarWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
}
declare type ToolBarOrientation = "horizontal" | "vertical";
declare var toolbarWidget: {
    "__#31@#template": HTMLElement;
    "__#31@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#31@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#31@#walkerNodeFilter"(node: Node): number;
    "__#31@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#31@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#31@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#31@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#31@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#31@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#31@#handleClickEvent"(event: Event): void;
    "__#31@#handleFocusEvent"(event: FocusEvent): void;
    "__#31@#handleFocusInEvent"(event: FocusEvent): void;
    "__#31@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#31@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
