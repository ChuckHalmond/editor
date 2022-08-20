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
    "__#51@#template": HTMLElement;
    "__#51@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#51@#walkerNodeFilter"(node: Node): number;
    "__#51@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#51@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#51@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#51@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#51@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#51@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#51@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#51@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#51@#handleClickEvent"(event: MouseEvent): void;
    "__#51@#handleFocusInEvent"(event: FocusEvent): void;
    "__#51@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#51@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#51@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
