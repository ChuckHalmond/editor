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
    "__#49@#template": HTMLElement;
    "__#49@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#49@#walkerNodeFilter"(node: Node): number;
    "__#49@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#49@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#49@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#49@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#49@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#49@#handleClickEvent"(event: MouseEvent): void;
    "__#49@#handleFocusInEvent"(event: FocusEvent): void;
    "__#49@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#49@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#49@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
