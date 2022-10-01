import { WidgetFactory } from "../Widget";
export { menuBarWidget };
declare global {
    interface WidgetNameMap {
        "menubar": MenuBarWidgetFactory;
    }
}
interface MenuBarWidgetFactory extends WidgetFactory {
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
}
declare var menuBarWidget: {
    "__#39@#template": HTMLElement;
    "__#39@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#39@#walkerNodeFilter"(node: Node): number;
    "__#39@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#39@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#39@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#39@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#39@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#39@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#39@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#39@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#39@#handleClickEvent"(event: MouseEvent): void;
    "__#39@#handleFocusInEvent"(event: FocusEvent): void;
    "__#39@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#39@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#39@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
