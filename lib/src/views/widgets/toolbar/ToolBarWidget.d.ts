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
    "__#11@#template": HTMLElement;
    "__#11@#walker": TreeWalker;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
    } | undefined): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#11@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#11@#walkerNodeFilter"(node: Node): number;
    "__#11@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#11@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#11@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#11@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#11@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#11@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#11@#handleClickEvent"(event: Event): void;
    "__#11@#handleFocusEvent"(event: FocusEvent): void;
    "__#11@#handleFocusInEvent"(event: FocusEvent): void;
    "__#11@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#11@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
