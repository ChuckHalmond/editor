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
    "__#26909@#template": HTMLElement;
    "__#26909@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#26909@#walkerNodeFilter"(node: Node): number;
    "__#26909@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#26909@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#26909@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#26909@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#26909@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#26909@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#26909@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#26909@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#26909@#handleClickEvent"(event: MouseEvent): void;
    "__#26909@#handleFocusInEvent"(event: FocusEvent): void;
    "__#26909@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#26909@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#26909@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
