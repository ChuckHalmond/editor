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
    "__#59@#template": HTMLElement;
    "__#59@#walker": TreeWalker;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(toolbar: HTMLElement): HTMLElement;
    "__#59@#getActiveItem"(toolbar: HTMLElement): HTMLElement | null;
    items(toolbar: HTMLElement): HTMLElement[];
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
    "__#59@#walkerNodeFilter"(node: Node): number;
    "__#59@#firstItem"(toolbar: Element): HTMLElement | null;
    "__#59@#lastItem"(toolbar: Element): HTMLElement | null;
    "__#59@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#59@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#59@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#59@#setActiveItem"(tree: HTMLElement, item: HTMLElement | null): void;
    "__#59@#handleClickEvent"(event: Event): void;
    "__#59@#handleFocusEvent"(event: FocusEvent): void;
    "__#59@#handleFocusInEvent"(event: FocusEvent): void;
    "__#59@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#59@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
