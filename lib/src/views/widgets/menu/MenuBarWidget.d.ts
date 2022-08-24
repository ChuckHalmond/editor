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
    "__#48@#template": HTMLElement;
    "__#48@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#48@#walkerNodeFilter"(node: Node): number;
    "__#48@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#48@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#48@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#48@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#48@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#48@#handleClickEvent"(event: MouseEvent): void;
    "__#48@#handleFocusInEvent"(event: FocusEvent): void;
    "__#48@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#48@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#48@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
