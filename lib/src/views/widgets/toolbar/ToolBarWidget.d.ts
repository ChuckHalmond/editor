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
    "__#23@#template": HTMLElement;
    "__#23@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#23@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#23@#walkerNodeFilter"(node: Node): number;
    "__#23@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#23@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#23@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#23@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#23@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#23@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#23@#handleClickEvent"(event: Event): void;
    "__#23@#handleFocusEvent"(event: FocusEvent): void;
    "__#23@#handleFocusInEvent"(event: FocusEvent): void;
    "__#23@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#23@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
