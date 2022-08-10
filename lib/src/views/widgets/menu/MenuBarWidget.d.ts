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
    "__#9267@#template": HTMLElement;
    "__#9267@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#9267@#walkerNodeFilter"(node: Node): number;
    "__#9267@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#9267@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#9267@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#9267@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#9267@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#9267@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#9267@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#9267@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#9267@#handleClickEvent"(event: MouseEvent): void;
    "__#9267@#handleFocusInEvent"(event: FocusEvent): void;
    "__#9267@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#9267@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#9267@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
