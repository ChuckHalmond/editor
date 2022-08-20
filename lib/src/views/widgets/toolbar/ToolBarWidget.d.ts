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
    "__#28@#template": HTMLElement;
    "__#28@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#28@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#28@#walkerNodeFilter"(node: Node): number;
    "__#28@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#28@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#28@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#28@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#28@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#28@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#28@#handleClickEvent"(event: Event): void;
    "__#28@#handleFocusEvent"(event: FocusEvent): void;
    "__#28@#handleFocusInEvent"(event: FocusEvent): void;
    "__#28@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#28@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
