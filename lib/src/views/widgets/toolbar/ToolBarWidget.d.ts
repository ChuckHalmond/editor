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
    "__#56@#template": HTMLElement;
    "__#56@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#56@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#56@#walkerNodeFilter"(node: Node): number;
    "__#56@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#56@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#56@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#56@#handleClickEvent"(event: Event): void;
    "__#56@#handleFocusEvent"(event: FocusEvent): void;
    "__#56@#handleFocusInEvent"(event: FocusEvent): void;
    "__#56@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#56@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
