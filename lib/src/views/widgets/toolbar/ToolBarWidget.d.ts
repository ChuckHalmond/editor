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
    "__#47@#template": HTMLElement;
    "__#47@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#47@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#47@#walkerNodeFilter"(node: Node): number;
    "__#47@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#47@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#47@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#47@#handleClickEvent"(event: Event): void;
    "__#47@#handleFocusEvent"(event: FocusEvent): void;
    "__#47@#handleFocusInEvent"(event: FocusEvent): void;
    "__#47@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#47@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
