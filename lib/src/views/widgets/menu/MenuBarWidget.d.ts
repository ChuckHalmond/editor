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
    "__#18311@#template": HTMLElement;
    "__#18311@#walker": TreeWalker;
    create(): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#18311@#walkerNodeFilter"(node: Node): number;
    "__#18311@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#18311@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#18311@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#18311@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#18311@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#18311@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#18311@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#18311@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#18311@#handleFocusInEvent"(event: FocusEvent): void;
    "__#18311@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#18311@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#18311@#handleClickEvent"(event: MouseEvent): void;
    "__#18311@#handleKeyDownEvent"(event: KeyboardEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
