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
    "__#14421@#template": HTMLElement;
    "__#14421@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#14421@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#14421@#walkerNodeFilter"(node: Node): number;
    "__#14421@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#14421@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#14421@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14421@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14421@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#14421@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#14421@#handleClickEvent"(event: Event): void;
    "__#14421@#handleFocusEvent"(event: FocusEvent): void;
    "__#14421@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14421@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14421@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
