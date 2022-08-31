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
    "__#57@#template": HTMLElement;
    "__#57@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#57@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#57@#walkerNodeFilter"(node: Node): number;
    "__#57@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#57@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#57@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#57@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#57@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#57@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#57@#handleClickEvent"(event: Event): void;
    "__#57@#handleFocusEvent"(event: FocusEvent): void;
    "__#57@#handleFocusInEvent"(event: FocusEvent): void;
    "__#57@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#57@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
