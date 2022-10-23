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
    "__#48@#template": HTMLElement;
    "__#48@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#48@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#48@#walkerNodeFilter"(node: Node): number;
    "__#48@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#48@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#48@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#48@#handleClickEvent"(event: Event): void;
    "__#48@#handleFocusEvent"(event: FocusEvent): void;
    "__#48@#handleFocusInEvent"(event: FocusEvent): void;
    "__#48@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#48@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
