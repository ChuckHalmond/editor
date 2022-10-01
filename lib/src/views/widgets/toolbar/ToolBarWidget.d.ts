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
    "__#49@#template": HTMLElement;
    "__#49@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#49@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#49@#walkerNodeFilter"(node: Node): number;
    "__#49@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#49@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#49@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#49@#handleClickEvent"(event: Event): void;
    "__#49@#handleFocusEvent"(event: FocusEvent): void;
    "__#49@#handleFocusInEvent"(event: FocusEvent): void;
    "__#49@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#49@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
