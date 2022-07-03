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
    "__#14373@#template": HTMLElement;
    "__#14373@#walker": TreeWalker;
    create(): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    "__#14373@#walkerNodeFilter"(node: Node): number;
    "__#14373@#getActiveItem"(menubar: HTMLElement): HTMLElement | null;
    "__#14373@#firstItem"(menubar: HTMLElement): HTMLElement | null;
    "__#14373@#lastItem"(menubar: HTMLElement): HTMLElement | null;
    "__#14373@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14373@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14373@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#14373@#isClosestMenu"(menubar: HTMLElement, target: HTMLElement): boolean;
    "__#14373@#nearestItem"(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#14373@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14373@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14373@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#14373@#handleClickEvent"(event: MouseEvent): void;
    "__#14373@#handleKeyDownEvent"(event: KeyboardEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
