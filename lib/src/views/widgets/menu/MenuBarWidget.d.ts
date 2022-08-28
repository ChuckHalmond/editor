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
    "__#46@#template": HTMLElement;
    "__#46@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#46@#walkerNodeFilter"(node: Node): number;
    "__#46@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#46@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#46@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#46@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#46@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#46@#handleClickEvent"(event: MouseEvent): void;
    "__#46@#handleFocusInEvent"(event: FocusEvent): void;
    "__#46@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#46@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#46@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
