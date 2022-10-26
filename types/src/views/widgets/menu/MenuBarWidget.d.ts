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
    "__#58@#template": HTMLElement;
    "__#58@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#58@#walkerNodeFilter"(node: Node): number;
    "__#58@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#58@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#58@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#58@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#58@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#58@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#58@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#58@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#58@#handleClickEvent"(event: MouseEvent): void;
    "__#58@#handleFocusInEvent"(event: FocusEvent): void;
    "__#58@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#58@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#58@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
