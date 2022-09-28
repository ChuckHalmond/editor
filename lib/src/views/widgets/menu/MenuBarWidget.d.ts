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
    "__#45@#template": HTMLElement;
    "__#45@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#45@#walkerNodeFilter"(node: Node): number;
    "__#45@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#45@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#45@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#45@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#45@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#45@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#45@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#45@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#45@#handleClickEvent"(event: MouseEvent): void;
    "__#45@#handleFocusInEvent"(event: FocusEvent): void;
    "__#45@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#45@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#45@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
