import { WidgetFactory } from "../Widget";
export { toolbarWidget };
declare global {
    interface WidgetNameMap {
        "toolbar": ToolBarWidgetFactory;
    }
}
interface ToolBarWidgetFactory extends WidgetFactory {
    create(init?: {
        tabIndex?: number;
    }): HTMLElement;
    setTabIndex(toolbar: HTMLElement, value: number): void;
    getTabIndex(toolbar: HTMLElement): number;
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
}
declare type ToolBarOrientation = "horizontal" | "vertical";
declare var toolbarWidget: {
    "__#53@#template": HTMLElement;
    "__#53@#walker": TreeWalker;
    create(init?: {
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#53@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setTabIndex(toolbar: HTMLElement, value: number): void;
    getTabIndex(toolbar: HTMLElement): number;
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#53@#walkerNodeFilter"(node: Node): number;
    "__#53@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#53@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#53@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#53@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#53@#handleClickEvent"(event: Event): void;
    "__#53@#handleFocusEvent"(event: FocusEvent): void;
    "__#53@#handleFocusInEvent"(event: FocusEvent): void;
    "__#53@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#53@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
