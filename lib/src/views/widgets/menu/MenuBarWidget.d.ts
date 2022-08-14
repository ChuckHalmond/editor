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
    "__#56@#template": HTMLElement;
    "__#56@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#56@#walkerNodeFilter"(node: Node): number;
    "__#56@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#56@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#56@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#56@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#56@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#56@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#56@#handleClickEvent"(event: MouseEvent): void;
    "__#56@#handleFocusInEvent"(event: FocusEvent): void;
    "__#56@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#56@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#56@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
