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
    "__#19@#template": HTMLElement;
    "__#19@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#19@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#19@#walkerNodeFilter"(node: Node): number;
    "__#19@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#19@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#19@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#19@#handleClickEvent"(event: Event): void;
    "__#19@#handleFocusEvent"(event: FocusEvent): void;
    "__#19@#handleFocusInEvent"(event: FocusEvent): void;
    "__#19@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#19@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
