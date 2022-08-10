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
    "__#10422@#template": HTMLElement;
    "__#10422@#walker": TreeWalker;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
    } | undefined): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#10422@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#10422@#walkerNodeFilter"(node: Node): number;
    "__#10422@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#10422@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#10422@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#10422@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#10422@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#10422@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#10422@#handleClickEvent"(event: Event): void;
    "__#10422@#handleFocusEvent"(event: FocusEvent): void;
    "__#10422@#handleFocusInEvent"(event: FocusEvent): void;
    "__#10422@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#10422@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
