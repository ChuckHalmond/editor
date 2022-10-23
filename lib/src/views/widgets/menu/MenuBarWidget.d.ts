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
    "__#38@#template": HTMLElement;
    "__#38@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#38@#walkerNodeFilter"(node: Node): number;
    "__#38@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#38@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#38@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#38@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#38@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#38@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#38@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#38@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#38@#handleClickEvent"(event: MouseEvent): void;
    "__#38@#handleFocusInEvent"(event: FocusEvent): void;
    "__#38@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#38@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#38@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
