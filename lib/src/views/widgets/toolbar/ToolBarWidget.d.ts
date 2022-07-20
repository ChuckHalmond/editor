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
    "__#30830@#template": HTMLElement;
    "__#30830@#walker": TreeWalker;
    create(init?: {
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#30830@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setTabIndex(toolbar: HTMLElement, value: number): void;
    getTabIndex(toolbar: HTMLElement): number;
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#30830@#walkerNodeFilter"(node: Node): number;
    "__#30830@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#30830@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#30830@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#30830@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#30830@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#30830@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#30830@#handleClickEvent"(event: Event): void;
    "__#30830@#handleFocusEvent"(event: FocusEvent): void;
    "__#30830@#handleFocusInEvent"(event: FocusEvent): void;
    "__#30830@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#30830@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
