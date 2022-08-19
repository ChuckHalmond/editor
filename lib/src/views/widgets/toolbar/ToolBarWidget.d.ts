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
    "__#36@#template": HTMLElement;
    "__#36@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#36@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#36@#walkerNodeFilter"(node: Node): number;
    "__#36@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#36@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#36@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#36@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#36@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#36@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#36@#handleClickEvent"(event: Event): void;
    "__#36@#handleFocusEvent"(event: FocusEvent): void;
    "__#36@#handleFocusInEvent"(event: FocusEvent): void;
    "__#36@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#36@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
