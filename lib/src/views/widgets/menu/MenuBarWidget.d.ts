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
    "__#55@#template": HTMLElement;
    "__#55@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#55@#walkerNodeFilter"(node: Node): number;
    "__#55@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#55@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#55@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#55@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#55@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#55@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#55@#handleClickEvent"(event: MouseEvent): void;
    "__#55@#handleFocusInEvent"(event: FocusEvent): void;
    "__#55@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#55@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#55@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
