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
    "__#55@#template": HTMLElement;
    "__#55@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#55@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#55@#walkerNodeFilter"(node: Node): number;
    "__#55@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#55@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#55@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#55@#handleClickEvent"(event: Event): void;
    "__#55@#handleFocusEvent"(event: FocusEvent): void;
    "__#55@#handleFocusInEvent"(event: FocusEvent): void;
    "__#55@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#55@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
