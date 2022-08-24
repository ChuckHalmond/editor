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
    "__#58@#template": HTMLElement;
    "__#58@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#58@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#58@#walkerNodeFilter"(node: Node): number;
    "__#58@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#58@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#58@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#58@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#58@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#58@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#58@#handleClickEvent"(event: Event): void;
    "__#58@#handleFocusEvent"(event: FocusEvent): void;
    "__#58@#handleFocusInEvent"(event: FocusEvent): void;
    "__#58@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#58@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
