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
    "__#47@#template": HTMLElement;
    "__#47@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#47@#walkerNodeFilter"(node: Node): number;
    "__#47@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#47@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#47@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#47@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#47@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#47@#handleClickEvent"(event: MouseEvent): void;
    "__#47@#handleFocusInEvent"(event: FocusEvent): void;
    "__#47@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#47@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#47@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
