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
    "__#63@#template": HTMLElement;
    "__#63@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#63@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#63@#walkerNodeFilter"(node: Node): number;
    "__#63@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#63@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#63@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#63@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#63@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#63@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#63@#handleClickEvent"(event: Event): void;
    "__#63@#handleFocusEvent"(event: FocusEvent): void;
    "__#63@#handleFocusInEvent"(event: FocusEvent): void;
    "__#63@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#63@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
