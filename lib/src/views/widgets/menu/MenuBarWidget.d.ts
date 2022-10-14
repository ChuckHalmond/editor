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
    "__#37@#template": HTMLElement;
    "__#37@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#37@#walkerNodeFilter"(node: Node): number;
    "__#37@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#37@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#37@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#37@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#37@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#37@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#37@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#37@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#37@#handleClickEvent"(event: MouseEvent): void;
    "__#37@#handleFocusInEvent"(event: FocusEvent): void;
    "__#37@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#37@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#37@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
