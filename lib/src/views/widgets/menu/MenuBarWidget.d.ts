import { WidgetFactory } from "../Widget";
export { menubarWidget };
declare global {
    interface WidgetNameMap {
        "menubar": MenuBarWidgetFactory;
    }
}
interface MenuBarWidgetFactory extends WidgetFactory {
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
}
declare var menubarWidget: {
    "__#43@#template": HTMLElement;
    "__#43@#walker": TreeWalker;
    create(): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#43@#walkerNodeFilter"(node: Node): number;
    "__#43@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#43@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#43@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#43@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#43@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#43@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#43@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#43@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#43@#handleFocusInEvent"(event: FocusEvent): void;
    "__#43@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#43@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#43@#handleClickEvent"(event: MouseEvent): void;
    "__#43@#handleKeyDownEvent"(event: KeyboardEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
